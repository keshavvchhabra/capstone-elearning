
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import image from "../public/lovable-uploads/ok.png"

const Hero = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 py-16">
      {/* Left side content */}
      <div className="flex-1">
        <h1 className="text-[#14152E] text-5xl md:text-6xl font-bold leading-tight">
          Get where you're going faster with <span className="text-[#A84261]">Akademy.</span>
        </h1>
        <p className="text-gray-600 text-lg mt-6">
          Expand your skills in development, testing, analysis, and designing.
        </p>
        <div className="flex flex-col sm:flex-row mt-10 gap-4">
          <Button className="bg-[#D9614E] hover:bg-[#C54E3D] text-white px-8 py-6 text-lg">
            Start Now
          </Button>
        </div>
      </div>
      <div className="flex-1 relative">
      <img 
          src={image}
          alt="Online Education Platform" 
          className="relative z-10 mx-auto lg:mx-0 w-full max-w-md"
        />
      </div>
    </div>
  );
};

export default Hero;
