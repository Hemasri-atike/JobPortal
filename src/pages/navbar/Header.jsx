import React, { useState } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", dropdown: ["Overview", "Updates", "Contact"] },
    { name: "Find Jobs", dropdown: ["Browse Jobs", "Job Alerts", "Saved Jobs"] },
    { name: "Employers", dropdown: ["Post a Job", "Manage Listings", "Search Candidates"] },
    { name: "Candidates", dropdown: ["Profile", "Resume Builder", "Applications"] },
    { name: "Blog", dropdown: ["Latest News", "Tips & Advice", "Success Stories"] },
    { name: "Pages", dropdown: ["About Us", "Pricing", "FAQs"] },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        {/* <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-lg">M</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-gray-900">Job Portal</span>
        </div> */}
    

<div className="flex items-center space-x-2">
  <Link to="/" className="flex items-center space-x-2">
    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
      <span className="text-white font-bold text-sm sm:text-lg">M</span>
    </div>
    <span className="text-xl sm:text-2xl font-bold text-gray-900">Job Portal</span>
  </Link>
</div>


        {/* Hamburger Menu */}
        <button
          className="xl:hidden text-gray-500 hover:text-blue-600 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8 relative">
          {menuItems.map((item, index) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setOpenDropdown(index)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <span className="text-sm lg:text-base">{item.name}</span>
                <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4" />
              </div>

              {openDropdown === index && (
                <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden border border-gray-100 z-50">
                  {item.dropdown.map((option) => (
                    <Link
                      key={option}
                      to={`/${option.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {option}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="xl:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {menuItems.map((item, index) => (
                <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                  <div
                    className="flex items-center justify-between py-3 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transform ${openDropdown === index ? "rotate-180" : ""}`}
                    />
                  </div>
                  {openDropdown === index && (
                    <div className="pl-4 pb-2">
                      {item.dropdown.map((option) => (
                        <Link
                          key={option}
                          to={`/${option.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {option}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        )}

        {/* Right Actions */}
        <div className="hidden xl:flex items-center space-x-3">
          <Link 
            to="/upload-cv" 
            className="text-gray-500 hover:text-blue-600 text-xs lg:text-sm px-3 py-1 rounded-md transition-colors"
          >
            Upload CV
          </Link>
          <Link
            to="/login"
            className="text-gray-500 hover:text-blue-600 text-xs lg:text-sm px-3 py-1 rounded-md transition-colors"
          >
            Login
          </Link>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs lg:text-sm px-4 py-1 rounded-md transition-colors">
            Post Job
          </button>
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600" />
            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-yellow-400 text-gray-900 text-xs rounded-full">
              1
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
