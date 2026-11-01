import React from 'react';
import { HeroSection } from '../../components/home/HeroSection';
import { StatsBar } from '../../components/home/StatsBar';
import { PopularCoursesSection } from '../../components/home/PopularCoursesSection';
import { ServicesSection } from '../../components/home/ServicesSection';
import { WhyChooseAndTrainers } from '../../components/home/WhyChooseAndTrainers';
import { TestimonialsSection } from '../../components/home/TestimonialsSection';
import { CtaBanner } from '../../components/home/CtaBanner';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsBar />
      <PopularCoursesSection />
      <ServicesSection />
      <WhyChooseAndTrainers />
      <TestimonialsSection />
      <CtaBanner />
    </div>
  );
};
