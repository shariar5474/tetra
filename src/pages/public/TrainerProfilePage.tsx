import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Globe,
  BookOpen,
  Award,
  Users,
  Star,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { LinkedInIcon, YouTubeIcon } from '../../components/common/SocialIcons';
import { useData } from '../../context/DataContext';

export const TrainerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trainers, courses } = useData();

  const trainer = trainers.find((t) => t.id === id) || trainers[0];
  const trainerCourses = courses.filter((c) => c.trainerId === trainer.id);

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-36 h-36 rounded-3xl overflow-hidden bg-slate-100 shrink-0 ring-4 ring-[#00A9FF]/20 shadow-xl">
              <img
                src={trainer.avatar}
                alt={trainer.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071426]">
                    {trainer.name}
                  </h1>
                  <div className="text-sm font-bold text-[#00A9FF]">
                    {trainer.designation} • {trainer.expertise}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <a
                    href={trainer.social.linkedin || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-100 hover:bg-[#0A66C2] hover:text-white transition text-slate-600"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={trainer.social.youtube || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-100 hover:bg-[#FF0000] hover:text-white transition text-slate-600"
                  >
                    <YouTubeIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={trainer.social.website || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-100 hover:bg-[#00A9FF] hover:text-white transition text-slate-600"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {trainer.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-3 text-xs sm:text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#00A9FF]" />
                  <span>{trainer.experienceYears}+ Years Practical Industry Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00A9FF]" />
                  <span>{trainer.totalStudents.toLocaleString()}+ Students Mentored</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{trainer.rating} / 5.0 Instructor Rating</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {trainer.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Courses Taught */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-[#071426]">
            Courses Taught by {trainer.name.split(' ')[0]}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainerCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition p-5 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full aspect-[16/10] object-cover rounded-xl mb-4"
                  />
                  <div className="text-xs text-[#00A9FF] font-bold mb-1 uppercase tracking-wider">
                    {c.badge}
                  </div>
                  <h3 className="font-bold text-[#071426] text-base mb-2">{c.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span>{c.lessonsCount} Lessons</span>
                    <span>{c.durationWeeks} Weeks</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {c.rating}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-base font-extrabold text-[#071426]">
                    ৳ {c.currentPrice.toLocaleString()}
                  </div>
                  <Link
                    to={`/courses/${c.slug}`}
                    className="px-4 py-2 rounded-lg bg-[#00A9FF] text-white text-xs font-semibold hover:bg-[#0096e6] transition"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
