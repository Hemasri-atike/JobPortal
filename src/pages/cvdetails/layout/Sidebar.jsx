import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  candidateSidebarItems,
  employeeSidebarItems,
} from "../../../store/sidebarItems.js";

const Sidebar = ({ role = "job_seeker" }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Select sidebar items based on role
  const sidebarItems =
    role === "employer" ? employeeSidebarItems : candidateSidebarItems;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-6 left-6 z-50 p-3 bg-[#89b4d4] shadow-4xl text-[#D1E9F6] hover:bg-[#3b4f73] transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#D1E9F6] focus:ring-opacity-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle Sidebar"
      >
        {isMobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* Sidebar */}
      
        <aside
          className={`fixed inset-y-0 left-0 w-65 min-h-screen bg-[#89b4d4] p-6 transform transition-all duration-500 ease-in-out
          ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-auto xl z-40 backdrop-blur-lg bg-opacity-95`}
        >
          <section className="relative top-20">
          {/* Logo/Title Section */}
          <div className="mb-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#D1E9F6] rounded-full flex items-center justify-center">
              <span className="text-[#3b4f73] font-bold text-lg">
                {role === "employer" ? "E" : "C"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {role === "employer" ? "Employer Hub" : "Candidate Hub"}
            </h2>
          </div>

          {/* Sidebar Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={label}
                to={path}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ease-in-out relative group
        ${
          location.pathname === path
            ? "bg-[#3b4f73] text-white shadow-inner"
            : "text-[#1a2639] hover:bg-[#D1E9F6] hover:text-[#2c3e50]"
        }`}
                onClick={() => setIsMobileOpen(false)}
              >
                {/* Icon */}
                <span className="text-xl transform group-hover:scale-110 transition-transform duration-200">
                  {Icon && (
                    <Icon
                      className={
                        location.pathname === path
                          ? "text-white"
                          : "text-[#4A628A]"
                      }
                    />
                  )}
                </span>

                {/* Label */}
                <span className="text-sm font-semibold tracking-wide">
                  {label}
                </span>

                {/* Active Indicator */}
                {location.pathname === path && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#3b4f73] rounded-r-md" />
                )}
              </Link>
            ))}
          </nav>

          
          </section>
          {/* Footer (Optional) */}
          <div className="absolute bottom-4 text-xs text-white">
            <p>
              © 2025 {role === "employer" ? "Employer" : "Candidate"} Dashboard
            </p>
          </div>
        </aside>
      

      {/* Dark Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-[#4A628A] bg-opacity-70 z-30 transition-opacity duration-500 ease-in-out"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
