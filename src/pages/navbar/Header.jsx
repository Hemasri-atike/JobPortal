import React from "react";
import { Bell, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-lg">M</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-gray-900">Job Portal</span>
        </div>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
          {["Home", "Find Jobs", "Employers", "Candidates", "Blog", "Pages"].map((item) => (
            <div
              key={item}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
            >
              <span className="text-sm lg:text-base">{item}</span>
              <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4" />
            </div>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          <button className="hidden md:flex text-gray-500 hover:text-blue-600 text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-md transition-colors">
            Upload CV
          </button>
          <button className="hidden sm:flex text-gray-500 hover:text-blue-600 text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-md transition-colors">
            Login
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs lg:text-sm px-3 lg:px-4 py-1 rounded-md transition-colors">
            Post Job
          </button>

          {/* Notification */}
          <div className="relative">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" />
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-yellow-400 text-gray-900 text-xs rounded-full">
              1
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
