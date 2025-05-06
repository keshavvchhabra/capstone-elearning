
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F7F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
        <Hero />
        <StatsSection />
      </div>
    </div>
  );
};

export default Index;
