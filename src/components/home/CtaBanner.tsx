import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TetraLogo } from '../common/TetraLogo';
import { useData } from '../../context/DataContext';

export const CtaBanner: React.FC = () => {
  const { websiteSettings } = useData();

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#071426] via-[#0E213D] to-[#071426] p-6 sm:p-10 border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Subtle Glows */}
          <div className="absolute left-1/3 top-0 w-80 h-32 bg-[#00A9FF]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Left: TETRA Logo */}
          <div className="relative z-10 shrink-0">
            <TetraLogo variant="horizontal" theme="dark" size="lg" />
          </div>

          {/* Center: Headline & Subtitle */}
          <div className="relative z-10 text-center md:text-left flex-1 max-w-xl">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {websiteSettings.ctaBanner.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1 leading-relaxed">
              {websiteSettings.ctaBanner.subtitle}
            </p>
          </div>

          {/* Right: CTA Button matching Reference */}
          <div className="relative z-10 shrink-0">
            <Link
              to={websiteSettings.ctaBanner.buttonLink || '/courses'}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#00A9FF] hover:bg-[#0096e6] text-white text-sm font-bold transition shadow-lg shadow-[#00A9FF]/30 cursor-pointer"
            >
              <span>{websiteSettings.ctaBanner.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
