import React from 'react';
import { Award, Users, BookOpen, ShieldCheck, Target, HeartHandshake } from 'lucide-react';
import { TetraLogo } from '../../components/common/TetraLogo';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#F5F7FC] min-h-screen">
      {/* Hero */}
      <div className="bg-[#071426] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#00A9FF] text-xs font-bold uppercase tracking-wider mb-4">
            About TETRA IT Institute
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Learn • Build • Grow with <span className="text-[#00A9FF]">TETRA</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
            Bridging the gap between traditional academic education and modern global tech industry requirements through practical, hands-on apprenticeship.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF6FF] text-[#00A9FF] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#071426]">Our Mission</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To empower 100,000+ youth with state-of-the-art technological proficiencies in AI Automation, Software Engineering, Performance Marketing, and Visual Design, preparing them to win high-ticket international freelancing jobs and enterprise careers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF6FF] text-[#00A9FF] flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#071426]">Our Dual Hybrid Model</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              TETRA operates not merely as an academy, but as a full-scale Digital Agency. Our students don’t just build toy demo projects; they gain first-hand apprenticeships on live client deliverables under senior agency engineers.
            </p>
          </div>
        </div>

        {/* Physical Campus & Infrastructure */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071426]">
            Physical Training Campus in Agrabad, Chattogram
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Located in the commercial heart of Chattogram, TETRA features high-speed fiber-connected computer labs, collaborative sprint zones, audio-visual studio recording rooms, and dedicated placement cells for our graduates.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-[#00A9FF] mb-1">5,000+ sq ft</div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Modern Lab Space</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-[#00A9FF] mb-1">100% Practical</div>
              <div className="text-xs text-slate-500 font-semibold uppercase">No Rote Theory</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-[#00A9FF] mb-1">Lifetime</div>
              <div className="text-xs text-slate-500 font-semibold uppercase">Career &amp; Placement Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
