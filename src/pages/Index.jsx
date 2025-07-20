import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import QuizTracking from './QuizTracking';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 py-12 text-white" style={{ backgroundColor: '#D9614E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-xl font-bold mb-4">Akademy</h3>
            <p className="text-gray-100 mb-6 max-w-md">
              Empowering learners with comprehensive quiz tracking and educational resources. 
              Track your progress, identify strengths, and excel in your learning journey.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-200 hover:bg-white/20">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-200 hover:bg-white/20">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-200 hover:bg-white/20">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-gray-200 hover:bg-white/20">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors">Quizzes</a></li>
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors">Progress</a></li>
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors">Resources</a></li>
              <li><a href="#" className="text-gray-100 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-200" />
                <span className="text-gray-100">info@akademy.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-200" />
                <span className="text-gray-100">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-200" />
                <span className="text-gray-100">123 Learning St, Education City</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/30 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-100 text-sm">
              © 2025 Akademy. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-100 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-100 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-100 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-[#F7F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
        <Hero />
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#14152E]">Your Quiz Progress</h2>
          <QuizTracking />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Index;