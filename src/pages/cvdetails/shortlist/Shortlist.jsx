import React from "react";
import Header from "../../navbar/Header";
import Sidebar from "../layout/Sidebar"

const Shortlist = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar - hidden on small screens */}
        <aside className="hidden md:block w-64  text-white">
          <Sidebar />
        </aside>

        {/* Content area */}
        <main className="flex-1 p-4 md:p-6 bg-gray-100 overflow-y-auto">
          <h4 className="text-xl font-semibold mb-4">Shortlist</h4>
          {/* Add your shortlist content here */}
        </main>
      </div>
    </div>
  );
};

export default Shortlist;
