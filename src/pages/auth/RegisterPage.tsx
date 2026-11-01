import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TetraLogo } from '../../components/common/TetraLogo';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setError('Please agree to the Terms & Conditions.');
      return;
    }
    setLoading(true);
    setError(null);

    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      navigate('/student/dashboard');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center p-4">
      <div className="absolute w-96 h-96 bg-[#00A9FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0B1B33] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <TetraLogo variant="horizontal" theme="dark" size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Student Account</h1>
          <p className="text-xs text-gray-400 mt-1">
            Join thousands of active learners building their careers with TETRA
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
            <label className="block text-gray-300 font-medium mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Ahmed"
                className="w-full pl-10 pr-4 py-3 bg-[#071426] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-[#071426] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1712-000000"
                className="w-full pl-10 pr-4 py-3 bg-[#071426] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-3 bg-[#071426] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-gray-400">
            <input
              type="checkbox"
              id="terms"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="rounded bg-[#071426] border-white/20 text-[#00A9FF] focus:ring-0"
            />
            <label htmlFor="terms">
              I agree to TETRA's Terms &amp; Conditions and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold text-sm transition shadow-lg shadow-[#00A9FF]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="text-[#00A9FF] font-semibold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
