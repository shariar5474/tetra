import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Award, Star } from 'lucide-react';
import { LinkedInIcon, YouTubeIcon } from '../../components/common/SocialIcons';
import { useData } from '../../context/DataContext';

export const TrainersPage: React.FC = () => {
  const { trainers } = useData();

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#00A9FF] text-xs font-bold uppercase tracking-wider mb-3">
            Industry Leaders &amp; Mentors
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071426] tracking-tight">
            Meet Our Expert <span className="text-[#00A9FF]">Trainers</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-3">
            Our faculty consists of veteran software engineers, AI architects, brand designers, and growth marketers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 mb-4 ring-4 ring-slate-50 shadow-md">
                <img
                  src={trainer.avatar}
                  alt={trainer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <Link
                to={`/trainers/${trainer.id}`}
                className="text-base font-extrabold text-[#071426] group-hover:text-[#00A9FF] transition mb-1"
              >
                {trainer.name}
              </Link>

              <div className="text-xs font-bold text-[#00A9FF] mb-0.5">
                {trainer.designation}
              </div>

              <div className="text-xs text-slate-500 mb-3">
                {trainer.expertise}
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-[#071426] mb-4">
                {trainer.experienceYears}+ Years Experience
              </span>

              <p className="text-xs text-slate-600 line-clamp-3 mb-5 leading-relaxed">
                {trainer.bio}
              </p>

              <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <a
                    href={trainer.social.linkedin || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0A66C2] transition"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={trainer.social.youtube || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#FF0000] transition"
                  >
                    <YouTubeIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={trainer.social.website || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#00A9FF] transition"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </div>

                <Link
                  to={`/trainers/${trainer.id}`}
                  className="text-xs font-bold text-[#00A9FF] hover:underline flex items-center gap-1"
                >
                  <span>Profile</span>
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
