import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Star,
  CheckCircle2,
  PlayCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Share2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const CourseDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { courses, enrollInCourse, enrollments } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const course = courses.find((c) => c.slug === slug || c.id === slug) || courses[0];
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    m1: true,
  });
  const [enrolling, setEnrolling] = useState(false);

  const isEnrolled = Boolean(
    user && enrollments.some((e) => e.courseId === course.id && e.studentId === user.id)
  );

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate(`/login?redirect=/courses/${course.slug}`);
      return;
    }
    if (isEnrolled) {
      navigate(`/student/learn/${course.id}`);
      return;
    }
    setEnrolling(true);
    await enrollInCourse(course, user.id, user.name, user.email);
    setEnrolling(false);
    navigate(`/student/learn/${course.id}`);
  };

  return (
    <div className="bg-[#F5F7FC] min-h-screen">
      {/* Dark Navy Header Section matching Brand */}
      <div className="bg-[#071426] text-white py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#00A9FF] text-white text-xs font-bold uppercase tracking-wider">
                  {course.badge}
                </span>
                <span className="text-xs text-gray-400 capitalize">
                  {course.category.replace('-', ' ')}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{course.rating.toFixed(1)}</span>
                  <span>({course.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#00A9FF]" />
                  <span>{course.lessonsCount} Total Lessons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#00A9FF]" />
                  <span>{course.durationWeeks} Weeks Full Duration</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <img
                  src={course.trainerAvatar}
                  alt={course.trainerName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00A9FF]"
                />
                <div>
                  <div className="text-xs text-gray-400">Taught by</div>
                  <div className="text-sm font-bold text-white">{course.trainerName}</div>
                </div>
              </div>
            </div>

            {/* Sticky Enrollment Card (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-inner bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-[#00A9FF] flex items-center justify-center shadow-lg">
                      <PlayCircle className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#071426]">
                      ৳ {course.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ৳ {course.previousPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-red-500 bg-red-50">
                    {course.discountPercent}% Off
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3.5 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold text-sm shadow-lg shadow-[#00A9FF]/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isEnrolled ? (
                    <>
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>{enrolling ? 'Enrolling...' : 'Enroll in This Course'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Full lifetime access to HD recordings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#00A9FF] shrink-0" />
                    <span>Recognized TETRA Course Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dedicated batch WhatsApp &amp; Discord support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* What you will learn */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-[#071426] mb-5">
                What You Will Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#00A9FF] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#071426]">Course Curriculum</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {course.modules.length} Modules • {course.lessonsCount} Lessons
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {course.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="border border-slate-200 rounded-xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-left transition cursor-pointer"
                    >
                      <div className="font-bold text-sm text-[#071426]">{mod.title}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{mod.duration}</span>
                        {expandedModules[mod.id] ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </button>

                    {expandedModules[mod.id] && (
                      <div className="divide-y divide-slate-100 bg-white">
                        {mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-3.5 sm:px-5 flex items-center justify-between text-xs sm:text-sm text-slate-700 hover:bg-slate-50/50"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.isFreePreview ? (
                                <PlayCircle className="w-4 h-4 text-[#00A9FF] shrink-0" />
                              ) : (
                                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <span className="font-medium">{lesson.title}</span>
                              {lesson.isFreePreview && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[10px] text-[#00A9FF] font-semibold">
                                  Free Preview
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-[#071426] mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                {course.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
