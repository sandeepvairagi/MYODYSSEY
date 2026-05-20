import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, Compass } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login(form);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back!');
      navigate(from);
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-10" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pl-10" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account? <Link to="/register" className="text-brand-600 font-medium">Sign up</Link>
          </p>
          <p className="text-center text-xs text-gray-400">Demo: user@myodyssey.com / user123</p>
        </form>
      </div>
    </div>
  );
}
