import React, { useState } from "react";
import Sidebar from "./layout/Sidebar";
import { Menu, X } from "lucide-react";
import Header from "../navbar/Header";

const Cvmanager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* Mobile Header */}
      <header className="lg:hidden flex justify-between items-center bg-white px-4 py-3 shadow sticky top-0 z-50">
        <h1 className="text-lg font-semibold">CV Manager</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-900"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } lg:block fixed lg:static top-0 left-0 h-full lg:h-auto bg-white shadow lg:shadow-none z-50 w-64`}
      >
        <Sidebar activePath="/cv-manager" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white rounded-lg shadow p-4 sm:p-6 mt-16 lg:mt-0 mx-4 lg:mx-6">
        <h1 className="text-lg sm:text-xl font-semibold mb-2">CV Manager</h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Ready to jump back in? Upload and manage your CVs here.
        </p>

        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-3">Drop files here to upload</p>
          <p className="text-xs sm:text-sm text-gray-400 mb-4">
            Max file size: 5MB — Allowed types: .doc, .docx, .pdf
          </p>
          <a
            href="/upload-cv"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm"
          >
            Upload Resume
          </a>
        </div>

        {/* CV List */}
        <div className="mt-6">
          <h2 className="text-base sm:text-lg font-medium mb-2">Your CVs</h2>
          <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1">
            <li>Resume_Hemasri.pdf</li>
            <li>FullStack_Developer_CV.pdf</li>
          </ul>
        </div>
      </main>
    </div></>
  );
};

export default Cvmanager;
