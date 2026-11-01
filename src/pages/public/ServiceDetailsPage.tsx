import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ServiceDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { services, submitServiceInquiry } = useData();

  const service =
    services.find((s) => s.slug === slug || s.id === slug) || services[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '৳ 30,000 - 50,000',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await submitServiceInquiry({
      ...formData,
      serviceCategory: service.title,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F5F7FC] min-h-screen">
      {/* Service Hero */}
      <div className="bg-[#071426] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#00A9FF] text-xs font-bold uppercase tracking-wider">
              {service.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {service.fullDescription}
            </p>
            <div className="flex items-center gap-6 pt-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00A9FF]" />
                <span>Estimated Timeline: {service.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00A9FF]" />
                <span>Starts at ৳ {service.startingPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* What is Included */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-[#071426]">Core Capabilities &amp; Features</h2>
              <div className="space-y-3">
                {service.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#00A9FF] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guaranteed Deliverables */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-[#071426]">Project Deliverables</h2>
              <div className="space-y-3">
                {service.deliverables.map((del, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Inquiry Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl sticky top-28">
              <h3 className="text-xl font-extrabold text-[#071426] mb-1">
                Request Service Proposal
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Tell us about your project requirements and our engineering team will get back to you within 24 hours.
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asif Mahmud"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00A9FF] text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1712-000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00A9FF] text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00A9FF] text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Estimated Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00A9FF] text-slate-800 bg-white"
                    >
                      <option value="৳ 20,000 - 35,000">৳ 20,000 - 35,000</option>
                      <option value="৳ 35,000 - 70,000">৳ 35,000 - 70,000</option>
                      <option value="৳ 70,000 - 150,000">৳ 70,000 - 150,000</option>
                      <option value="৳ 150,000+ Enterprise">৳ 150,000+ Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Project Details &amp; Objectives</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe what you want to build or automate..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00A9FF] text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold transition shadow-lg shadow-[#00A9FF]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Inquiry...' : 'Submit Service Inquiry'}</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-[#071426]">Inquiry Received!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Our client solutions manager will review your specs and contact you at <strong>{formData.email}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', budget: '৳ 30,000 - 50,000', message: '' });
                    }}
                    className="text-xs font-bold text-[#00A9FF] hover:underline"
                  >
                    Submit another inquiry &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
