import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchMyBookings } from '../redux/slices/bookingSlice';
import { formatPrice, formatDate, getImageUrl } from '../utils/formatters';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

export default function MyTripsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-2">My Trips</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-10">Track and manage your bookings</p>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="card h-32 animate-pulse bg-gray-200 dark:bg-gray-800" />)}
        </div>
      ) : list.length ? (
        <div className="space-y-6">
          {list.map((booking) => (
            <div key={booking._id} className="card p-6 flex flex-col md:flex-row gap-6">
              <img
                src={getImageUrl(booking.destination)}
                alt=""
                className="w-full md:w-48 h-36 object-cover rounded-xl"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
                }}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{booking.destination?.title}</h3>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" /> {booking.destination?.location}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                  <span>{booking.travelers} travelers</span>
                  <span className="font-semibold text-brand-600">{formatPrice(booking.totalPrice)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Ref: {booking.bookingReference}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">No trips booked yet</p>
          <Link to="/explore" className="btn-primary">Find Your Next Trip</Link>
        </div>
      )}
    </div>
  );
}
