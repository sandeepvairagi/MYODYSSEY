import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { PageSkeleton } from '../components/common/Skeleton';

const HomePage = lazy(() => import('../pages/HomePage'));
const ExplorePage = lazy(() => import('../pages/ExplorePage'));
const DestinationDetailPage = lazy(() => import('../pages/DestinationDetailPage'));
const BookingPage = lazy(() => import('../pages/BookingPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const MyTripsPage = lazy(() => import('../pages/MyTripsPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminDestinations = lazy(() => import('../pages/admin/AdminDestinations'));
const AdminBookings = lazy(() => import('../pages/admin/AdminBookings'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const SuspenseWrap = ({ children }) => (
  <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12"><PageSkeleton /></div>}>
    {children}
  </Suspense>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<SuspenseWrap><HomePage /></SuspenseWrap>} />
        <Route path="explore" element={<SuspenseWrap><ExplorePage /></SuspenseWrap>} />
        <Route path="destinations/:id" element={<SuspenseWrap><DestinationDetailPage /></SuspenseWrap>} />
        <Route path="login" element={<SuspenseWrap><LoginPage /></SuspenseWrap>} />
        <Route path="register" element={<SuspenseWrap><RegisterPage /></SuspenseWrap>} />
        <Route path="book/:id" element={<SuspenseWrap><ProtectedRoute><BookingPage /></ProtectedRoute></SuspenseWrap>} />
        <Route path="profile" element={<SuspenseWrap><ProtectedRoute><ProfilePage /></ProtectedRoute></SuspenseWrap>} />
        <Route path="wishlist" element={<SuspenseWrap><ProtectedRoute><WishlistPage /></ProtectedRoute></SuspenseWrap>} />
        <Route path="my-trips" element={<SuspenseWrap><ProtectedRoute><MyTripsPage /></ProtectedRoute></SuspenseWrap>} />
        <Route path="*" element={<SuspenseWrap><NotFoundPage /></SuspenseWrap>} />
      </Route>
      <Route path="admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<SuspenseWrap><AdminDashboard /></SuspenseWrap>} />
        <Route path="destinations" element={<SuspenseWrap><AdminDestinations /></SuspenseWrap>} />
        <Route path="bookings" element={<SuspenseWrap><AdminBookings /></SuspenseWrap>} />
        <Route path="users" element={<SuspenseWrap><AdminUsers /></SuspenseWrap>} />
      </Route>
    </Routes>
  );
}
