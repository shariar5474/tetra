import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useData();
  const approvedTestimonials = testimonials.filter((t) => t.approved);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + approvedTestimonials.length) % approvedTestimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % approvedTestimonials.length);
  };

  // We show up to 3 cards simultaneously or cycle
  const visibleCards = approvedTestimonials.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Reference */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="w-8 sm:w-12 h-0.5 bg-slate-300" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071426] tracking-tight">
              What Our <span className="text-[#00A9FF]">Students Say</span>
            </h2>
            <span className="w-8 sm:w-12 h-0.5 bg-[#00A9FF]" />
          </div>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Real feedback from our learners who have transformed their careers with TETRA.
          </p>
        </div>

        {/* Testimonials Carousel Container with Left/Right Arrows matching Reference */}
        <div className="relative">
          {/* Arrow Left */}
          <button
            onClick={handlePrev}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#00A9FF] hover:border-[#00A9FF] transition cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Arrow Right */}
          <button
            onClick={handleNext}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#00A9FF] hover:border-[#00A9FF] transition cursor-pointer"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Grid matching Reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {visibleCards.map((test) => (
              <div
                key={test.id}
                className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Student Profile & 5 Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={test.avatar}
                        alt={test.studentName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100 shadow"
                      />
                      <div>
                        <div className="font-bold text-sm text-[#071426] leading-tight">
                          {test.studentName}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          {test.profession}
                        </div>
                      </div>
                    </div>

                    {/* 5 Stars matching Reference */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bengali Quote text matching Reference */}
                  <p className="text-xs sm:text-[13px] text-slate-700 font-bengali font-normal leading-relaxed italic">
                    {test.quoteBengali}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Course: {test.courseTitle}</span>
                  <Quote className="w-3.5 h-3.5 text-blue-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
