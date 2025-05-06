
import React from 'react';
import { cn } from '@/lib/utils';


const IconCard = ({ className, color = "bg-white", children }) => {
  return (
    <div className={cn(
      "absolute rounded-xl shadow-lg p-4 flex items-center justify-center",
      color,
      className
    )}>
      {children}
    </div>
  );
};

export default IconCard;
