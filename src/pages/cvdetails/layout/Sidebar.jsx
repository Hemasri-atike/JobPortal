import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { candidateSidebarItems, employeeSidebarItems } from "../../../store/sidebarItems.js";

const Sidebar = ({ role = "job_seeker" }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Select sidebar items based on role
  const sidebarItems = role === "employer" ? employeeSidebarItems : candidateSidebarItems;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle Sidebar"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-br from-indigo-50 via-teal-50 to-gray-50 text-gray-900 p-6 transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-full md:rounded-3xl md:shadow-md z-40 backdrop-blur-sm bg-opacity-90`}
      >
        <div className="mb-8">
          {/* Role Title */}
          <div className="text-xs text-indigo-600 uppercase tracking-wider font-semibold mb-4">
            {role === "employer" ? "Employer Dashboard" : "Candidate Dashboard"}
          </div>

          {/* Sidebar Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={label}
                to={path}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-in-out ${
                  location.pathname === path
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-800"
                } group relative`}
                onClick={() => setIsMobileOpen(false)}
              >
                {/* Icon */}
                <span className="text-xl transform group-hover:scale-110 transition-transform duration-200">
                  <Icon className={location.pathname === path ? "text-white" : "text-indigo-600"} />
                </span>

                {/* Label */}
                <span className="text-sm font-semibold">{label}</span>

                {/* Hover Indicator */}
                <span className="absolute left-0 top-0 h-full w-1 bg-coral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Dark Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-60 z-30 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;