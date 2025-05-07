
import React from 'react';
import Logo from './Logo';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="py-4 flex justify-between items-center">
      <div className="flex items-center space-x-12">
        <Logo />
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-800 hover:text-[#A84261] transition-colors">Home</a>
          <Link to={"/quiz"}><a href="#" className="text-gray-800 hover:text-[#A84261] transition-colors flex items-center">
            Quizes <ChevronDown className="ml-1 h-4 w-4" />
          </a></Link>
          <a href="#" className="text-gray-800 hover:text-[#A84261] transition-colors flex items-center">
            Courses <ChevronDown className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 rounded-full p-2">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <Link to={"/auth"}>
        <Button variant="outline" className="border-gray-300 text-gray-800">
          Sign Up
        </Button>
        </Link>
        <Link to={"/auth"}>
        <Button className="bg-[#D9614E] hover:bg-[#C54E3D] text-white">
          Sign In
        </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
