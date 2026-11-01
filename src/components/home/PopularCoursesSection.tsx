import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Star, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';

export const PopularCoursesSection: React.FC = () => {
  const { courses, enrollInCourse } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  // Take the 4 primary courses matching the reference
  const displayedCourses = courses.slice(0, 4);

  const handleEnrollClick = (course: Course) => {
    if (!user) {
      // Prompt student to login or register
      navigate('/login?redirect=/courses/' + course.slug);
      return;
    }
    setSelectedCourse(course);
    setEnrollModalOpen(true);
    setEnrollSuccess(false);
  };

  const handleConfirmEnrollment = async () => {
    if (!selectedCourse || !user) return;
    setEnrolling(true);
    await new Promise((r) => setTimeout(r, 600));
    await enrollInCourse(selectedCourse, user.id, user.name, user.email);
    setEnrolling(false);
    setEnrollSuccess(true);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F5F7FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Reference */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 sm:w-12 h-0.5 bg-slate-300" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071426] tracking-tight">
                Popular <span className="text-[#00A9FF]">Courses</span>
              </h2>
              <span className="w-8 sm:w-12 h-0.5 bg-[#00A9FF]" />
            </div>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Industry-focused, practical courses to grow your skills and career.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00A9FF] hover:text-[#087BFF] transition group cursor-pointer"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Course Cards Grid matching Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Course Thumbnail & Badge */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge matching Reference (Bestseller, Popular, Trending, Career Focused) */}
                <div className="absolute top-3 left-3">
                  <span
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase shadow text-white"
                    style={{
                      backgroundColor:
                        course.badge === 'Bestseller'
                          ? '#F59E0B'
                          : course.badge === 'Popular'
                          ? '#EF4444'
                          : course.badge === 'Trending'
                          ? '#8B5CF6'
                          : '#EC4899',
                    }}
                  >
                    {course.badge}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="block text-base font-bold text-[#071426] hover:text-[#00A9FF] transition line-clamp-1 mb-2.5"
                    title={course.title}
                  >
                    {course.title}
                  </Link>

                  {/* Metadata: Lessons & Duration */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.lessonsCount} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.durationWeeks} Weeks</span>
                    </div>
                  </div>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-1.5 mb-4 text-xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800">{course.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({course.reviewCount.toLocaleString()})</span>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-[#071426]">
                        ৳ {course.currentPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ৳ {course.previousPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-red-500 bg-red-50">
                      {course.discountPercent}% Off
                    </span>
                  </div>

                  {/* Enroll Now Button matching Reference */}
                  <button
                    type="button"
                    onClick={() => handleEnrollClick(course)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#00A9FF] hover:bg-[#0096e6] text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-[#00A9FF]/20 group-hover:bg-[#087BFF] cursor-pointer"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollment Checkout Modal */}
      {enrollModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6">
            <button
              onClick={() => setEnrollModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!enrollSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCourse.thumbnail}
                    alt={selectedCourse.title}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold text-[#071426] text-sm leading-snug">
                      {selectedCourse.title}
                    </h3>
                    <div className="text-xs text-[#00A9FF] font-semibold mt-0.5">
                      {selectedCourse.durationWeeks} Weeks • {selectedCourse.lessonsCount} Lessons
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Course Fee:</span>
                    <span>৳ {selectedCourse.previousPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({selectedCourse.discountPercent}%):</span>
                    <span>- ৳ {(selectedCourse.previousPrice - selectedCourse.currentPrice).toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#071426]">
                    <span>Total Payable:</span>
                    <span className="text-[#00A9FF]">৳ {selectedCourse.currentPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Enrolling as: <strong className="text-slate-800">{user?.name}</strong> ({user?.email})
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEnrollModalOpen(false)}
                    className="flex-1 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={enrolling}
                    onClick={handleConfirmEnrollment}
                    className="flex-1 py-2.5 rounded-lg bg-[#00A9FF] hover:bg-[#0096e6] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                  >
                    {enrolling ? 'Processing...' : 'Confirm Enrollment'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#071426]">Enrollment Successful!</h3>
                <p className="text-xs text-slate-500">
                  You now have complete access to all lessons, assignments and certificates.
                </p>
                <div className="pt-3 flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setEnrollModalOpen(false);
                      navigate('/student/dashboard');
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#00A9FF] text-white text-xs font-semibold hover:bg-[#0096e6] cursor-pointer"
                  >
                    Go to Student Classroom &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
