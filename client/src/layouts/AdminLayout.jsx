import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, MapPin, Users, Calendar, Compass } from 'lucide-react';

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed h-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand-600" />
            <span className="font-display font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {adminNav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon className="w-5 h-5" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
