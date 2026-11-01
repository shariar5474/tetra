import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TetraLogo } from '../../components/common/TetraLogo';

export const LoginPage: React.FC = () => {
  const { login, switchRoleDemo } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/student/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (email.includes('admin')) {
        navigate('/admin/dashboard');
      } else if (email.includes('trainer')) {
        navigate('/trainer/dashboard');
      } else {
        navigate(redirect);
      }
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-[#00A9FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0B1B33] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <TetraLogo variant="horizontal" theme="dark" size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Student Portal Login</h1>
          <p className="text-xs text-gray-400 mt-1">
            Access your course lessons, assignments &amp; certificates
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-gray-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@tetra.com.bd"
                className="w-full pl-10 pr-4 py-3 bg-[#071426] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-300 font-medium">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-[#00A9FF] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#071426] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold text-sm transition shadow-lg shadow-[#00A9FF]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Logging in...' : 'Sign In to Portal'}</span>
          </button>
        </form>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00A9FF]" />
            <span>Quick Demo 1-Click Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                switchRoleDemo('student');
                navigate('/student/dashboard');
              }}
              className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition text-center cursor-pointer"
            >
              Log in as Student
            </button>
            <button
              type="button"
              onClick={() => {
                switchRoleDemo('super_admin');
                navigate('/admin/dashboard');
              }}
              className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 transition text-center cursor-pointer"
            >
              Log in as Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#00A9FF] font-semibold hover:underline">
            Register here
          </Link>
          <div className="mt-2 pt-2 border-t border-white/5">
            <Link to="/trainer-login" className="text-gray-400 hover:text-white transition">
              Are you an instructor? <span className="text-[#00A9FF] underline">Trainer Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
