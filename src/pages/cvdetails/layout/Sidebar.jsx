import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { sidebarItems } from "../../../store/sidebarItems.js"

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4 transform transition-transform duration-300 ease-in-out 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:h-full md:rounded-lg md:shadow-lg z-40`}
      >
        {sidebarItems.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              {section.section}
            </div>
            <nav className="space-y-2">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                  } group relative`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="text-xl transform group-hover:scale-110 transition-transform duration-200">
                    <item.icon />
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="absolute left-0 top-0 h-full w-1 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </aside>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
