import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Star, ArrowRight, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const CoursesPage: React.FC = () => {
  const { courses } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'ai', label: 'AI & Automation' },
    { id: 'digital-marketing', label: 'Digital Marketing' },
    { id: 'graphics-design', label: 'Graphics Design' },
    { id: 'web-dev', label: 'Web Development' },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#00A9FF] text-xs font-bold uppercase tracking-wider mb-3">
            Career-Ready Curriculum
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071426] tracking-tight">
            Explore Professional <span className="text-[#00A9FF]">Training Programs</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Master in-demand skills taught by active industry practitioners with live capstone projects.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#00A9FF] text-white shadow-md shadow-[#00A9FF]/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00A9FF]"
            />
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
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

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="block text-base font-bold text-[#071426] hover:text-[#00A9FF] transition line-clamp-1 mb-2.5"
                  >
                    {course.title}
                  </Link>

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

                  <div className="flex items-center gap-1.5 mb-4 text-xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800">{course.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({course.reviewCount.toLocaleString()})</span>
                  </div>
                </div>

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

                  <Link
                    to={`/courses/${course.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#00A9FF] hover:bg-[#0096e6] text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-[#00A9FF]/20"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No courses match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1">Try searching with a different keyword or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
