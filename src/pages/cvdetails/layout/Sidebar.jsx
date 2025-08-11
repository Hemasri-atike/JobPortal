import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaClipboardList,
  FaBell,
  FaStar,
  FaIdBadge,
  FaBox,
  FaCommentDots,
} from "react-icons/fa";

const Sidebar = () => {
  const sidebarItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaUser />, label: "My Profile", path: "/cadprofile" },
    { icon: <FaFileAlt />, label: "My Resume", path: "/resume" },
    { icon: <FaClipboardList />, label: "Applied Jobs", path: "/applied" },
    { icon: <FaBell />, label: "Job Alerts", path: "/job-alerts" },
    { icon: <FaStar />, label: "Shortlisted Jobs", path: "/shortlisted-jobs" },
    { icon: <FaIdBadge />, label: "CV Manager", path: "/cvmanager" },
    { icon: <FaBox />, label: "Packages", path: "/packages" },
    { icon: <FaCommentDots />, label: "Messages", path: "/messages" },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow p-4">
      {sidebarItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
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
  );
};

export default Sidebar;
