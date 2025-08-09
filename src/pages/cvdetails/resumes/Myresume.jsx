import React, { useState } from "react";
import Header from "../../navbar/Header";
import Sidebar from "../layout/Sidebar"

const Myresume = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar for large screens */}
        <div className="hidden lg:block w-64  text-white">
          <Sidebar />
        </div>

        {/* Sidebar for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-64 bg-gray-800 text-white z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 p-4 overflow-auto">
          <h1 className="text-2xl font-bold">My Resume</h1>
          <p className="mt-4 text-gray-700">
            This is the My Resume page content area. You can add your resume details here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Myresume;
