import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { User, Mail, Phone } from 'lucide-react';

export default function ProfilePage() {
  const { user, getMe } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(form);
      await getMe();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updatePassword(passwordForm);
      toast.success('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="section-title mb-8">My Profile</h1>
      <div className="card p-8 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-semibold rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-10" placeholder="Name" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-10" placeholder="Phone" />
          </div>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field h-24 resize-none" placeholder="Bio" />
          <button type="submit" disabled={loading} className="btn-primary">Save Changes</button>
        </form>
      </div>
      <div className="card p-8">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <input type="password" placeholder="Current Password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="input-field" required />
          <input type="password" placeholder="New Password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input-field" required minLength={6} />
          <button type="submit" className="btn-outline">Update Password</button>
        </form>
      </div>
    </div>
  );
}
