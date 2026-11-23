import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import { formatPrice, formatDate } from '../../utils/formatters';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    adminService.getBookings().then((res) => setBookings(res.data.data));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateBooking(id, { status });
      toast.success('Status updated');
      const res = await adminService.getBookings();
      setBookings(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Bookings</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left p-4">Reference</th>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Destination</th>
              <th className="text-left p-4">Dates</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id} className="border-t dark:border-gray-800">
                  <td className="p-4 font-mono text-xs">{b.bookingReference || b._id}</td>
                  <td className="p-4">{b.user?.name || '—'}</td>
                  <td className="p-4">{b.destination?.title || '—'}</td>
                  <td className="p-4">{formatDate(b.startDate)}</td>
                  <td className="p-4 font-semibold">{formatPrice(b.totalPrice)}</td>
                  <td className="p-4">
                    <select value={b.status} onChange={(e) => updateStatus(b._id, e.target.value)} className="input-field py-1 text-sm">
                      {['pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
