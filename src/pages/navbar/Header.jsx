import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo5.png"

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const location = useLocation();

  const menuItems = [
    {
      name: "Home",
      dropdown: [
        { label: "Overview", path: "/home/overview" },
        { label: "Updates", path: "/home/updates" },
        { label: "Contact", path: "/contact-us" },
      ],
    },
    {
      name: "Find Jobs",
      dropdown: [
        { label: "Browse Jobs", path: "/jobsearch" },
        { label: "Job Alerts", path: "/job-alerts" },
        { label: "Saved Jobs", path: "/savedjobs" },
      ],
    },
    {
      name: "Employers",
      dropdown: [
        { label: "Post a Job", path: "/empposting" },
        { label: "Manage Listings", path: "/employers/manage" },
        { label: "Search Candidates", path: "/employers/candidates" },
      ],
    },
    {
      name: "Candidates",
      dropdown: [
        { label: "Profile", path: "/cadprofile" },
        { label: "Resume Builder", path: "/candidates/resume" },
        { label: "Applications", path: "/candidates/applications" },
      ],
    },
  ];

  // Handle dropdown hover with delay
  const handleMouseEnter = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Toggle dropdown for mobile
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Close menus on link click
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header className="bg-[#1E3A8A] border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        {/* <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={handleLinkClick}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1E3A8A] font-bold text-sm sm:text-lg">I</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">hire</span>
          </Link>
        </div> */}
        {/* Logo */}
<div className="flex items-center space-x-2">
  <Link
    to="/"
    className="flex items-center space-x-2"
    onClick={handleLinkClick}
  >
    <img
      src={logo}
      alt="I Hire Logo"
      className="h-16 w-16 sm:h-10 object-contain"
    />
  </Link>
</div>


        {/* Hamburger Menu */}
        <button
          className="xl:hidden text-white hover:text-yellow-300 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-6 2xl:space-x-8 relative">
          {menuItems.map((item, index) => (
            <div
              key={item.name}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center space-x-1 text-white hover:text-yellow-300 cursor-pointer transition-colors duration-200">
                <span className="text-sm lg:text-base">{item.name}</span>
                <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-200 group-hover:rotate-180" />
              </div>

              {openDropdown === index && (
                <div
                  className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden border border-gray-100 z-50 transform transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
                  role="menu"
                >
                  {item.dropdown.map((option) => (
                    <Link
                      key={option.label}
                      to={option.path}
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                        location.pathname === option.path ? "bg-gray-100 font-semibold" : ""
                      }`}
                      onClick={handleLinkClick}
                      role="menuitem"
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="xl:hidden absolute top-full left-0 w-full bg-[#1E3A8A] border-b border-gray-200 shadow-lg z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {menuItems.map((item, index) => (
                <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                  <div
                    className="flex items-center justify-between py-3 text-white hover:text-yellow-300 cursor-pointer transition-colors duration-200"
                    onClick={() => toggleDropdown(index)}
                    role="button"
                    aria-expanded={openDropdown === index}
                    aria-controls={`mobile-dropdown-${index}`}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transform transition-transform duration-200 ${
                        openDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {openDropdown === index && (
                    <div
                      className="pl-4 pb-2 transition-all duration-200 ease-in-out"
                      id={`mobile-dropdown-${index}`}
                    >
                      {item.dropdown.map((option) => (
                        <Link
                          key={option.label}
                          to={option.path}
                          className={`block px-4 py-2 text-sm text-white hover:bg-yellow-300 ${
                            location.pathname === option.path ? "bg-yellow-300 text-[#1E3A8A]" : ""
                          }`}
                          onClick={handleLinkClick}
                        >
                          {option.label}
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
            className={`text-white hover:text-yellow-300 text-xs lg:text-sm px-3 py-1 rounded-md transition-colors ${
              location.pathname === "/upload-cv" ? "bg-gray-100 text-[#1E3A8A]" : ""
            }`}
            onClick={handleLinkClick}
          >
            Upload CV
          </Link>
          <Link
            to="/login"
            className={`text-black hover:text-yellow-300 text-xs lg:text-sm px-3 py-1 rounded-md transition-colors ${
              location.pathname === "/login" ? "bg-gray-100 text-[#1E3A8A]" : ""
            }`}
            onClick={handleLinkClick}
          >
            Login
          </Link>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-[#1E3A8A] font-semibold text-xs lg:text-sm px-4 py-1 rounded-md transition-colors"
            onClick={handleLinkClick}
          >
            Post Job
          </button>
          <div className="relative">
            <Bell
              className="w-5 h-5 text-white cursor-pointer hover:text-yellow-300"
              aria-label="Notifications"
            />
            <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-yellow-400 text-[#1E3A8A] text-xs rounded-full">
              1
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;