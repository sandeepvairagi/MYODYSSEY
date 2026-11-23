import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatPrice } from '../../utils/formatters';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((res) => setData(res.data))
      .catch((err) => toast.error(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />)}</div>;

  const { stats, recentBookings } = data || {};
  const cards = [
    { label: 'Users', value: stats?.users ?? 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Destinations', value: stats?.destinations ?? 0, icon: MapPin, color: 'bg-green-500' },
    { label: 'Bookings', value: stats?.bookings ?? 0, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Revenue', value: formatPrice(stats?.revenue || 0), icon: IndianRupee, color: 'bg-accent' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
              </div>
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b dark:border-gray-700">
                <th className="pb-3">Reference</th>
                <th className="pb-3">User</th>
                <th className="pb-3">Destination</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((b) => (
                  <tr key={b._id} className="border-b dark:border-gray-800">
                    <td className="py-3 font-mono text-xs">{b.bookingReference || b._id}</td>
                    <td className="py-3">{b.user?.name || '—'}</td>
                    <td className="py-3">{b.destination?.title || '—'}</td>
                    <td className="py-3 capitalize">{b.status}</td>
                    <td className="py-3 font-semibold">{formatPrice(b.totalPrice)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    No recent bookings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
