import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Layers,
  Award,
  Briefcase,
  Cpu,
  TrendingUp,
  PenTool,
  Code,
  ArrowRight,
  Zap,
  CheckCircle,
  Headphones,
  Bot,
  Workflow,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const HeroSection: React.FC = () => {
  const { heroSlides } = useData();
  const enabledSlides = heroSlides.filter((s) => s.enabled);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    if (enabledSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % enabledSlides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [enabledSlides.length]);

  const slide = enabledSlides[currentSlideIndex] || enabledSlides[0];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + enabledSlides.length) % enabledSlides.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % enabledSlides.length);
  };

  // Icon resolver
  const renderIcon = (name: string, className = 'w-4 h-4') => {
    switch (name) {
      case 'PlayCircle':
        return <PlayCircle className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'PenTool':
        return <PenTool className={className} />;
      case 'Code':
        return <Code className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'CheckCircle':
        return <CheckCircle className={className} />;
      case 'Headphones':
        return <Headphones className={className} />;
      case 'Bot':
        return <Bot className={className} />;
      case 'Workflow':
        return <Workflow className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  if (!slide) return null;

  return (
    <section className="relative bg-[#071426] text-white overflow-hidden py-10 lg:py-16 border-b border-white/5">
      {/* Background Radial Glow Effects matching Reference */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00A9FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-[#087BFF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Carousel Navigation Arrow - Left */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition shadow-lg cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Carousel Navigation Arrow - Right */}
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition shadow-lg cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[480px]"
          >
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-5 lg:pr-4">
              {/* Promotional Pill Badge matching Reference */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs sm:text-sm font-medium text-gray-200 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#00A9FF] animate-pulse" />
                <span>{slide.badgeText}</span>
              </div>

              {/* Large Headline matching Reference */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.15]">
                {slide.headlineLine1} <br />
                {slide.headlineLine2}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A9FF] via-[#38BDF8] to-[#087BFF] drop-shadow-[0_0_15px_rgba(0,169,255,0.4)]">
                  {slide.headlineHighlight}
                </span>
              </h1>

              {/* Supporting Text matching Reference */}
              <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
                {slide.description}
              </p>

              {/* 4 Feature Pills in a row matching Reference */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                {slide.featurePills.map((pill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0E1F38] border border-white/10 text-xs sm:text-[13px] text-gray-200 font-medium"
                  >
                    <span className="text-[#00A9FF]">{renderIcon(pill.icon, 'w-3.5 h-3.5')}</span>
                    <span>{pill.label}</span>
                  </div>
                ))}
              </div>

              {/* Two CTA Buttons matching Reference */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  to={slide.primaryBtnLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#00A9FF] hover:bg-[#0096e6] transition shadow-lg shadow-[#00A9FF]/30 cursor-pointer"
                >
                  <span>{slide.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={slide.secondaryBtnLink}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#0B1B33] hover:bg-[#112747] border border-white/15 transition cursor-pointer"
                >
                  {slide.secondaryBtnText}
                </Link>
              </div>
            </div>

            {/* Right Side: Hero Visual & Floating Badges (5 cols) */}
            <div className="lg:col-span-5 relative flex justify-center items-center mt-6 lg:mt-0">
              {/* Outer Decorative Glow Circles */}
              <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
                {/* Glowing Circular Base */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00A9FF]/20 to-transparent blur-2xl" />
                <div className="absolute w-[90%] h-[90%] rounded-full border border-blue-400/20" />

                {/* Hero Student Graphic with Headphones & TETRA Laptop */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img
                    src={slide.studentImage}
                    alt="TETRA Student Professional"
                    className="w-full h-auto max-h-[380px] object-contain rounded-2xl drop-shadow-[0_15px_30px_rgba(0,169,255,0.25)]"
                  />
                </div>

                {/* Floating Technology Labels matching Reference exactly */}
                {slide.floatingTags[0] && (
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-4 left-0 sm:-left-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#091B33]/90 border border-white/15 shadow-xl backdrop-blur-md"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-[#00A9FF]">
                      {renderIcon(slide.floatingTags[0].icon, 'w-4 h-4')}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {slide.floatingTags[0].label}
                    </span>
                  </motion.div>
                )}

                {slide.floatingTags[1] && (
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute top-20 right-0 sm:-right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#091B33]/90 border border-white/15 shadow-xl backdrop-blur-md"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      {renderIcon(slide.floatingTags[1].icon, 'w-4 h-4')}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {slide.floatingTags[1].label}
                    </span>
                  </motion.div>
                )}

                {slide.floatingTags[2] && (
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-20 left-0 sm:-left-2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#091B33]/90 border border-white/15 shadow-xl backdrop-blur-md"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                      {renderIcon(slide.floatingTags[2].icon, 'w-4 h-4')}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {slide.floatingTags[2].label}
                    </span>
                  </motion.div>
                )}

                {slide.floatingTags[3] && (
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                    className="absolute bottom-4 right-0 sm:-right-2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#091B33]/90 border border-white/15 shadow-xl backdrop-blur-md"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-[#00A9FF]">
                      {renderIcon(slide.floatingTags[3].icon, 'w-4 h-4')}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {slide.floatingTags[3].label}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Pagination Dots at Bottom Center */}
        {enabledSlides.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            {enabledSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'w-7 bg-[#00A9FF]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
