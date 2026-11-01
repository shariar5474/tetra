import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Globe } from 'lucide-react';
import { LinkedInIcon, YouTubeIcon } from '../common/SocialIcons';
import { useData } from '../../context/DataContext';

export const WhyChooseAndTrainers: React.FC = () => {
  const { websiteSettings, trainers } = useData();

  return (
    <section className="py-16 sm:py-20 bg-[#F5F7FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT SIDE: "Why Choose TETRA?" Dark Navy Card (5 cols) */}
          <div className="lg:col-span-5 relative bg-[#071426] text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col justify-between border border-white/10">
            {/* Subtle glow background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A9FF]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">
                Why Choose <span className="text-[#00A9FF]">TETRA</span>?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* 6 Checklist items */}
                <div className="sm:col-span-7 space-y-3.5">
                  {websiteSettings.whyChooseTetra.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#00A9FF]/20 flex items-center justify-center shrink-0 text-[#00A9FF]">
                        <CheckCircle2 className="w-4 h-4 fill-current text-[#00A9FF]" />
                      </div>
                      <span className="text-xs sm:text-[13px] font-medium text-gray-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 3D Illuminated Trophy matching Reference */}
                <div className="sm:col-span-5 flex justify-center items-center py-2 sm:py-0">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#00A9FF]/30 rounded-full blur-xl animate-pulse" />
                    <img
                      src="/assets/extracted/why-trophy.png"
                      alt="TETRA Trophy"
                      className="relative z-10 max-h-[140px] sm:max-h-[170px] w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,169,255,0.4)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">100% Practical &amp; Career Oriented</span>
              <Link
                to="/about"
                className="text-xs font-bold text-[#00A9FF] hover:underline flex items-center gap-1"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: "Meet Our Expert Trainers" (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#071426] tracking-tight">
                  Meet Our Expert <span className="text-[#00A9FF]">Trainers</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Learn from industry professionals with real-world experience.
                </p>
              </div>

              <Link
                to="/trainers"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#00A9FF] hover:text-[#087BFF] transition group cursor-pointer"
              >
                <span>View All Trainers</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 4 Trainer Cards matching Reference */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {trainers.slice(0, 4).map((trainer) => (
                <div
                  key={trainer.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
                >
                  {/* Photo with rounded framing */}
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-slate-100 mb-2.5 shadow-inner">
                    <img
                      src={trainer.avatar}
                      alt={trainer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Name */}
                  <Link
                    to={`/trainers/${trainer.id}`}
                    className="text-xs sm:text-[13px] font-extrabold text-[#071426] group-hover:text-[#00A9FF] transition line-clamp-1 mb-0.5"
                    title={trainer.name}
                  >
                    {trainer.name}
                  </Link>

                  {/* Designation */}
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2 min-h-[28px] mb-2 leading-tight">
                    {trainer.designation}
                  </p>

                  {/* Experience Badge */}
                  <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-[#071426] mb-2.5">
                    {trainer.experienceYears}+ Years Experience
                  </span>

                  {/* Social Links matching Reference */}
                  <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-100 w-full text-slate-400">
                    <a
                      href={trainer.social.linkedin || 'https://linkedin.com'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="hover:text-[#0A66C2] transition"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={trainer.social.youtube || 'https://youtube.com'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="YouTube"
                      className="hover:text-[#FF0000] transition"
                    >
                      <YouTubeIcon className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={trainer.social.website || 'https://tetra.com.bd'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Portfolio"
                      className="hover:text-[#00A9FF] transition"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
