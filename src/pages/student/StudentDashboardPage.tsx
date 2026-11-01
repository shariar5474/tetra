import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Clock,
  PlayCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { enrollments, courses } = useData();

  const userEnrollments = enrollments.filter(
    (e) => e.studentId === user?.id || e.studentEmail === user?.email
  );

  const completedCount = userEnrollments.filter((e) => e.progressPercent === 100).length;
  const inProgressCount = userEnrollments.filter((e) => e.progressPercent < 100).length;

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-100 shadow"
            />
            <div>
              <div className="text-xs font-bold text-[#00A9FF] uppercase tracking-wider">
                Student Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071426]">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Keep advancing your skills. Real-world projects await you today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/student/assignments"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Assignments
            </Link>
            <Link
              to="/student/certificates"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Certificates
            </Link>
            <Link
              to="/student/profile"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Profile Settings
            </Link>
            <Link
              to="/courses"
              className="px-4 py-2 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white text-xs font-bold shadow-md shadow-[#00A9FF]/20 transition flex items-center gap-1.5"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#00A9FF] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#071426]">{userEnrollments.length}</div>
              <div className="text-xs text-slate-500 font-medium">Enrolled Courses</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#071426]">{inProgressCount}</div>
              <div className="text-xs text-slate-500 font-medium">Courses In Progress</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#071426]">{completedCount}</div>
              <div className="text-xs text-slate-500 font-medium">Completed Courses</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#071426]">
                {userEnrollments.filter((e) => e.certificateIssued).length}
              </div>
              <div className="text-xs text-slate-500 font-medium">Certificates Earned</div>
            </div>
          </div>
        </div>

        {/* My Enrolled Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#071426]">My Active Programs</h2>
            <span className="text-xs text-slate-500">Pick up right where you left off</span>
          </div>

          {userEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userEnrollments.map((enr) => {
                const courseData = courses.find((c) => c.id === enr.courseId);
                return (
                  <div
                    key={enr.id}
                    className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                        <img
                          src={enr.courseThumbnail || courseData?.thumbnail || '/assets/extracted/course-ai.png'}
                          alt={enr.courseTitle}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[11px] text-white font-bold">
                          {enr.progressPercent}% Complete
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <h3 className="font-bold text-base text-[#071426] line-clamp-1">
                          {enr.courseTitle}
                        </h3>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Progress</span>
                            <span className="font-bold text-[#00A9FF]">{enr.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#00A9FF] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${enr.progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                          <span>{enr.completedLessons.length} lessons finished</span>
                          <span>Enrolled: {enr.enrolledAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <Link
                        to={`/student/learn/${enr.courseId}`}
                        className="w-full py-3 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue Learning Classroom</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-4">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700">No courses enrolled yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Discover our industry-aligned curriculum in AI Automation, Web Development, and Digital Marketing to get started.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00A9FF] text-white text-xs font-bold"
              >
                Browse Course Catalog
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
