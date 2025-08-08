import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Bell, ChevronDown, Menu, X } from "lucide-react";

const Cvmanager = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { name: "Home", dropdown: ["Overview", "Updates", "Contact"] },
    { name: "Find Jobs", dropdown: ["Browse Jobs", "Job Alerts", "Saved Jobs"] },
    { name: "Employers", dropdown: ["Post a Job", "Manage Listings", "Search Candidates"] },
    { name: "Candidates", dropdown: ["Profile", "Resume Builder", "Applications"] },
    { name: "Blog", dropdown: ["Latest News", "Tips & Advice", "Success Stories"] },
    { name: "Pages", dropdown: ["About Us", "Pricing", "FAQs"] },
  ];

  const sidebarItems = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard" },
    { icon: "👤", label: "My Profile", path: "/profile" },
    { icon: "📄", label: "My Resume", path: "/resume" },
    { icon: "📋", label: "Applied Jobs", path: "/applied-jobs" },
    { icon: "🔔", label: "Job Alerts", path: "/job-alerts" },
    { icon: "⭐", label: "Shortlisted Jobs", path: "/shortlisted-jobs" },
    { icon: "📂", label: "CV Manager", path: "/cv-manager", active: true },
    { icon: "📦", label: "Packages", path: "/packages" },
    { icon: "💬", label: "Messages", path: "/messages" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">M</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold">Job Portol</span>
          </div>

          {/* Hamburger Menu Button (Visible on Mobile) */}
          <button
            className="lg:hidden text-gray-500 hover:text-blue-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-4">
            {menuItems.map((item, index) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setOpenDropdown(index)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                  <span className="text-sm font-medium">{item.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>

                {/* Dropdown */}
                {openDropdown === index && (
                  <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden border border-gray-100 z-50">
                    {item.dropdown.map((option) => (
                      <Link
                        key={option}
                        to={`/${option.toLowerCase().replace(/\s+/g, "-")}`}
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

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50">
              <div className="container mx-auto px-4 py-2">
                {menuItems.map((item, index) => (
                  <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                    <div
                      className="flex items-center justify-between py-2 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
                      onClick={() =>
                        setOpenDropdown(openDropdown === index ? null : index)
                      }
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transform ${
                          openDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openDropdown === index && (
                      <div className="pl-4 pb-2">
                        {item.dropdown.map((option) => (
                          <Link
                            key={option}
                            to={`/${option.toLowerCase().replace(/\s+/g, "-")}`}
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <Link
              to="/upload-cv"
              className="text-gray-500 hover:text-blue-600 text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-md transition-colors"
            >
              Upload CV
            </Link>
            <Link
              to="/login"
              className="text-gray-500 hover:text-blue-600 text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-md transition-colors"
            >
              Login
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs lg:text-sm px-3 lg:px-4 py-1 rounded-md transition-colors">
              Post Job
            </button>
            <div className="relative">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-yellow-400 text-gray-900 text-xs rounded-full">
                1
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white rounded-lg shadow p-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center space-x-3 p-2 rounded-md ${
                item.active
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </aside>

        {/* CV Manager Section */}
        <main className="flex-1 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">CV Manager!</h1>
          <p className="text-gray-600 mb-6">Ready to jump back in?</p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
            <div className="text-gray-500 mb-4">Drop files here to upload</div>
            <p className="text-sm text-gray-400 mb-4">
              To upload file size is (Max 5MB) and allowed file types are (.doc, .docx, .pdf)
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Upload Resume
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cvmanager;