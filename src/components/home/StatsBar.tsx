import React from 'react';
import { Users, GraduationCap, Laptop, Layers, Award } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const StatsBar: React.FC = () => {
  const { statistics } = useData();

  const statsItems = [
    {
      icon: Users,
      value: statistics.learnersCount,
      label: 'Happy Learners',
    },
    {
      icon: GraduationCap,
      value: statistics.trainersCount,
      label: 'Expert Trainers',
    },
    {
      icon: Laptop,
      value: statistics.coursesCount,
      label: 'Online Courses',
    },
    {
      icon: Layers,
      value: statistics.servicesCount,
      label: 'IT Services',
    },
    {
      icon: Award,
      value: statistics.successRate,
      label: 'Success Rate',
    },
  ];

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
      <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 py-6 px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
          {statsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 lg:justify-center px-2 sm:px-4 group"
              >
                {/* Blue circular icon container matching Reference */}
                <div className="w-12 h-12 rounded-full bg-[#EBF6FF] text-[#00A9FF] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#00A9FF] group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#071426] tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
