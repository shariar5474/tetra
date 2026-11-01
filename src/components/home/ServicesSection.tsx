import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Megaphone,
  PenTool,
  Code,
  Workflow,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ServicesSection: React.FC = () => {
  const { services } = useData();

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Bot':
        return <Bot className="w-6 h-6 text-[#00A9FF]" />;
      case 'Megaphone':
        return <Megaphone className="w-6 h-6 text-[#00A9FF]" />;
      case 'PenTool':
        return <PenTool className="w-6 h-6 text-[#00A9FF]" />;
      case 'Code':
        return <Code className="w-6 h-6 text-[#00A9FF]" />;
      case 'Workflow':
        return <Workflow className="w-6 h-6 text-[#00A9FF]" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-[#00A9FF]" />;
      default:
        return <Bot className="w-6 h-6 text-[#00A9FF]" />;
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Reference */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 sm:w-12 h-0.5 bg-slate-300" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071426] tracking-tight">
                Our <span className="text-[#00A9FF]">Services</span>
              </h2>
              <span className="w-8 sm:w-12 h-0.5 bg-[#00A9FF]" />
            </div>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              We deliver AI-driven and result-oriented digital solutions for individuals and businesses.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00A9FF] hover:text-[#087BFF] transition group cursor-pointer"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6-Column Service Cards matching Reference */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {services.slice(0, 6).map((service) => (
            <Link
              key={service.id}
              to={`/services/${service.slug}`}
              className="bg-[#F8FAFC] hover:bg-white rounded-2xl p-5 border border-slate-200/70 hover:border-blue-400/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
            >
              {/* Icon in circular container matching Reference */}
              <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-[#EBF6FF] shadow-sm flex items-center justify-center mb-4 transition-colors">
                {getServiceIcon(service.iconName)}
              </div>

              {/* Title */}
              <h3 className="text-sm font-extrabold text-[#071426] group-hover:text-[#00A9FF] transition mb-1 line-clamp-1">
                {service.title}
              </h3>

              {/* Tagline / Subtitle */}
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {service.tagline}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
