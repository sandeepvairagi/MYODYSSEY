import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, Sun, Moon, Heart, User, LogOut, LayoutDashboard, Compass } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../redux/slices/authSlice';

const navLinks = [
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/wishlist', label: 'Wishlist', icon: Heart, auth: true },
  { to: '/my-trips', label: 'My Trips', icon: null, auth: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">
              My<span className="gradient-text">-Odyssey</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 dark:text-gray-300 hover:text-brand-600'}`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="text-sm font-medium text-accent hover:text-accent-dark">
                Admin
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.[0]}
                  </div>
                  <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => {
            if (link.auth && !isAuthenticated) return null;
            return (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="block py-2 font-medium">
                {link.label}
              </Link>
            );
          })}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 font-medium text-accent">
              <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2"><User className="w-4 h-4" /> Profile</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-red-500"><LogOut className="w-4 h-4" /> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block py-2">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
