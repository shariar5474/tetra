import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TetraLogo } from '../../components/common/TetraLogo';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md bg-[#0B1B33] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <TetraLogo variant="horizontal" theme="dark" size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-xs text-gray-400 mt-1">
            Enter your registered email address and we'll send you recovery instructions.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Your Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#071426] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00A9FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold text-sm transition shadow-lg shadow-[#00A9FF]/30 cursor-pointer"
            >
              Send Password Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Reset Link Sent</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              If an account exists for <strong>{email}</strong>, a password reset email has been dispatched. Please check your inbox and spam folder.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-[#00A9FF] hover:underline font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
