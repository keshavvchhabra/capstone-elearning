
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="17" r="4" fill="#346A5B" />
        <circle cx="17" cy="10" r="4" fill="#346A5B" />
        <circle cx="24" cy="17" r="4" fill="#346A5B" />
      </svg>
      <span className="text-2xl font-bold ml-2">
        <span className="text-[#A84261]">Keshav Academy</span>
      </span>
    </div>
  );
};

export default Logo;
