import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaFileAlt, FaClipboardList, FaBell, FaStar,
   FaIdBadge, FaBox, FaCommentDots, FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { icon: <FaHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaUser />, label: 'My Profile', path: '/cadprofile' },
    { icon: <FaFileAlt />, label: 'My Resume', path: '/resume' },
    { icon: <FaClipboardList />, label: 'Applied Jobs', path: '/applied' },
    { icon: <FaBell />, label: 'Job Alerts', path: '/job-alerts' },
    { icon: <FaStar />, label: 'Shortlisted Jobs', path: '/shortlisted-jobs' },
    { icon: <FaIdBadge />, label: 'CV Manager', path: '/cvmanager' },
    { icon: <FaBox />, label: 'Packages', path: '/packages' },
    { icon: <FaCommentDots />, label: 'Messages', path: '/messages' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-full md:bg-gray-900 md:rounded-lg md:shadow-lg z-40`}
      >
        <div className="flex items-center justify-between mb-6">
          {/* <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-[#1E3A8A] font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold">Hire</span>
          </div> */}
          <button
            className="md:hidden text-white hover:text-yellow-400"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Candidate Dashboard</div>
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
              } group relative`}
              onClick={() => setIsMobileOpen(false)}
              aria-label={`Navigate to ${item.label}`}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              <span className="text-xl transform group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
              <span className="absolute left-0 top-0 h-full w-1 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Sidebar;