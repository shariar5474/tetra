import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ShieldAlert, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TetraLogo } from '../../components/common/TetraLogo';

export const TrainerLoginPage: React.FC = () => {
  const { loginTrainer, switchRoleDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginTrainer(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/trainer/dashboard');
    } else {
      setError(res.error || 'Invalid trainer credentials or unauthorized account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center p-4">
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0B1B33] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <TetraLogo variant="horizontal" theme="dark" size="lg" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty &amp; Instructor Portal</span>
          </div>

          <h1 className="text-2xl font-bold text-white">Trainer Login</h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign in to manage course modules, evaluate assignments &amp; track student submissions
          </p>
        </div>

        {/* Security Warning Notice matching Requirement 14 */}
        <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-snug">
            Trainer accounts cannot be self-registered. Credentials are issued directly by the TETRA Super Admin board.
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-gray-300 font-medium mb-1">Trainer Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trainer@tetra.com.bd"
                className="w-full pl-10 pr-4 py-3 bg-[#071426] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-300 font-medium">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-purple-400 hover:underline">
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
                className="w-full pl-10 pr-4 py-3 bg-[#071426] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In as Trainer'}</span>
          </button>
        </form>

        {/* 1-Click Trainer Demo Access */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={() => {
              switchRoleDemo('trainer');
              navigate('/trainer/dashboard');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-purple-300 text-xs font-semibold transition cursor-pointer"
          >
            Instant 1-Click Demo Trainer Login &rarr;
          </button>
        </div>

        <div className="mt-5 text-center text-xs text-gray-400">
          Not a trainer?{' '}
          <Link to="/login" className="text-[#00A9FF] font-semibold hover:underline">
            Go to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};
