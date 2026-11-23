import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { Users, CreditCard } from 'lucide-react';
import { fetchDestination } from '../redux/slices/destinationSlice';
import { createBooking } from '../redux/slices/bookingSlice';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { loadRazorpay } from '../utils/loadRazorpay';
import { formatPrice, getImageUrl } from '../utils/formatters';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current } = useSelector((s) => s.destinations);
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    startDate: null,
    endDate: null,
    travelers: 2,
    contactInfo: { name: user?.name || '', email: user?.email || '', phone: '' },
    specialRequests: '',
  });
  const [estimate, setEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDestination(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!current || !form.startDate || !form.endDate) {
      setEstimate(null);
      return;
    }
    setEstimateLoading(true);
    bookingService
      .getEstimate({
        destinationId: current._id,
        travelers: form.travelers,
        startDate: form.startDate.toISOString(),
        endDate: form.endDate.toISOString(),
      })
      .then((res) => setEstimate(res.data))
      .catch((err) => {
        setEstimate(null);
        toast.error(err.message || 'Could not calculate price');
      })
      .finally(() => setEstimateLoading(false));
  }, [current, form.startDate, form.endDate, form.travelers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      toast.error('Please select travel dates');
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(createBooking({
        destination: current._id,
        startDate: form.startDate,
        endDate: form.endDate,
        travelers: form.travelers,
        contactInfo: form.contactInfo,
        specialRequests: form.specialRequests,
      }));

      if (!createBooking.fulfilled.match(result)) {
        toast.error(result.payload);
        return;
      }

      const booking = result.payload;

      const confirmDemoBooking = async () => {
        await paymentService.confirmDemo(booking._id);
        toast.success('Trip confirmed! (Demo payment — no Razorpay keys required)');
        navigate('/my-trips');
      };

      const loaded = await loadRazorpay();
      if (!loaded) {
        await confirmDemoBooking();
        return;
      }

      try {
        const orderRes = await paymentService.createOrder(booking._id);
        const { order, key } = orderRes.data;

        const options = {
          key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'My-Odyssey',
          description: `Booking: ${current.title}`,
          order_id: order.id,
          handler: async (response) => {
            await paymentService.verify({
              ...response,
              bookingId: booking._id,
            });
            toast.success('Payment successful! Trip confirmed.');
            navigate('/my-trips');
          },
          prefill: { name: form.contactInfo.name, email: form.contactInfo.email },
          theme: { color: '#0ea5e9' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (paymentErr) {
        const msg = paymentErr.message?.toLowerCase() || '';
        if (msg.includes('razorpay') || msg.includes('not configured')) {
          await confirmDemoBooking();
          return;
        }
        throw paymentErr;
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!current) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-8">Book Your Trip</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <DatePicker selected={form.startDate} onChange={(d) => setForm({ ...form, startDate: d })} minDate={new Date()} className="input-field w-full" placeholderText="Select start date" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <DatePicker selected={form.endDate} onChange={(d) => setForm({ ...form, endDate: d })} minDate={form.startDate || new Date()} className="input-field w-full" placeholderText="Select end date" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Travelers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="number" min="1" max={current.maxGroupSize || 20} value={form.travelers} onChange={(e) => setForm({ ...form, travelers: parseInt(e.target.value, 10) || 1 })} className="input-field pl-10" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Full Name" value={form.contactInfo.name} onChange={(e) => setForm({ ...form, contactInfo: { ...form.contactInfo, name: e.target.value } })} className="input-field" required />
            <input type="email" placeholder="Email" value={form.contactInfo.email} onChange={(e) => setForm({ ...form, contactInfo: { ...form.contactInfo, email: e.target.value } })} className="input-field" required />
            <input placeholder="Phone" value={form.contactInfo.phone} onChange={(e) => setForm({ ...form, contactInfo: { ...form.contactInfo, phone: e.target.value } })} className="input-field md:col-span-2" />
          </div>
          <textarea placeholder="Special requests (optional)" value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} className="input-field h-24 resize-none" />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <CreditCard className="w-5 h-5" /> {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>

        <div className="card p-6 h-fit sticky top-24">
          <img src={getImageUrl(current)} alt="" className="w-full h-40 object-cover rounded-xl mb-4" />
          <h3 className="font-bold text-lg">{current.title}</h3>
          <p className="text-gray-500 text-sm">{current.location}, {current.country}</p>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Price per person</span><span>{formatPrice(current.pricePerPerson)}</span></div>
            <div className="flex justify-between"><span>Travelers</span><span>{form.travelers}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-brand-600">
                {estimateLoading ? 'Calculating...' : estimate ? formatPrice(estimate.totalPrice) : '—'}
              </span>
            </div>
            {!estimate && !estimateLoading && (
              <p className="text-xs text-gray-500 mt-2">Select start and end dates to calculate your total price.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
