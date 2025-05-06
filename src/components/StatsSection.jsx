
import React from 'react';
import { Eye, Users, Award } from 'lucide-react';


const StatItem = ({ icon, value, label, color }) => {
  return (
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-3xl text-gray-800">{value}</p>
        <p className="text-gray-600">{label}</p>
      </div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <div className="bg-white rounded-2xl py-10 px-12 mt-12 flex flex-col md:flex-row justify-between gap-8">
      <StatItem 
        icon={<Eye className="h-6 w-6 text-blue-900" />} 
        value="20M" 
        label="Views" 
        color="bg-blue-50"
      />
      <StatItem 
        icon={<Users className="h-6 w-6 text-pink-700" />} 
        value="50K" 
        label="Students" 
        color="bg-pink-50"
      />
      <StatItem 
        icon={<Award className="h-6 w-6 text-yellow-700" />} 
        value="4K" 
        label="Certificates" 
        color="bg-yellow-50"
      />
    </div>
  );
};

export default StatsSection;
