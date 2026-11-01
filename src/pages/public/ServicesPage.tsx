import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Megaphone,
  PenTool,
  Code,
  Workflow,
  Headphones,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ServicesPage: React.FC = () => {
  const { services } = useData();

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Bot':
        return <Bot className="w-8 h-8 text-[#00A9FF]" />;
      case 'Megaphone':
        return <Megaphone className="w-8 h-8 text-[#00A9FF]" />;
      case 'PenTool':
        return <PenTool className="w-8 h-8 text-[#00A9FF]" />;
      case 'Code':
        return <Code className="w-8 h-8 text-[#00A9FF]" />;
      case 'Workflow':
        return <Workflow className="w-8 h-8 text-[#00A9FF]" />;
      case 'Headphones':
        return <Headphones className="w-8 h-8 text-[#00A9FF]" />;
      default:
        return <Bot className="w-8 h-8 text-[#00A9FF]" />;
    }
  };

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#00A9FF] text-xs font-bold uppercase tracking-wider mb-3">
            Digital Agency &amp; Enterprise Solutions
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071426] tracking-tight">
            High-Performance <span className="text-[#00A9FF]">Digital Services</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
            We architect end-to-end digital experiences, AI automation pipelines, and scalable software solutions designed to generate tangible business ROI.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-blue-400/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#EBF6FF] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {getServiceIcon(srv.iconName)}
                </div>

                <div className="text-xs font-bold text-[#00A9FF] uppercase tracking-wider mb-1">
                  {srv.category}
                </div>

                <h3 className="text-xl font-extrabold text-[#071426] mb-2 group-hover:text-[#00A9FF] transition">
                  {srv.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                  {srv.fullDescription}
                </p>

                <div className="space-y-2.5 mb-8">
                  {srv.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#00A9FF] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Starting from</div>
                  <div className="text-base font-extrabold text-[#071426]">
                    ৳ {srv.startingPrice.toLocaleString()}
                  </div>
                </div>

                <Link
                  to={`/services/${srv.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#071426] group-hover:bg-[#00A9FF] text-white text-xs font-bold transition shadow"
                >
                  <span>Explore Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
