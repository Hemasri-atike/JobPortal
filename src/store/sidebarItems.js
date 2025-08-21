// src/config/sidebarItems.js
// src/config/sidebarConfig.js
import { FaHome, FaUser, FaFileAlt, FaClipboardList, FaBell, FaStar, FaIdBadge, FaBox, FaCommentDots } from 'react-icons/fa';

export const sidebarItems = [
  {
    section: "Candidate Dashboard",
    items: [
      { icon: FaHome, label: "Dashboard", path: "/dashboard" },
      { icon: FaUser, label: "My Profile", path: "/cadprofile" },
      { icon: FaFileAlt, label: "My Resume", path: "/resume" },
      { icon: FaClipboardList, label: "Applied Jobs", path: "/applied" },
      { icon: FaBell, label: "Job Alerts", path: "/job-alerts" },
      { icon: FaStar, label: "Shortlisted Jobs", path: "/shortlisted-jobs" },
      { icon: FaIdBadge, label: "CV Manager", path: "/cvmanager" },
      { icon: FaBox, label: "Packages", path: "/packages" },
      { icon: FaCommentDots, label: "Messages", path: "/messages" },
    ],
  },
  // You can add more sections (e.g., Admin Dashboard)
  // {
  //   section: "Admin Panel",
  //   items: [
  //     { icon: FaUserShield, label: "Manage Users", path: "/admin/users" },
  //   ]
  // }
];

        