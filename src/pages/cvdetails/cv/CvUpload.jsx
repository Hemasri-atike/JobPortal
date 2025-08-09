import React from "react";
import Header from "../../navbar/Header";
import Sidebar from "../layout/Sidebar";

const CvUpload = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar - collapses on small screens */}
        <div className="hidden md:block w-64 bg-gray-100 ">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">CV Upload</h2>
          
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <p className="mb-4 text-gray-600">Upload your CV to apply for jobs quickly.</p>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              className="block w-full border border-gray-300 rounded-lg p-2 cursor-pointer"
            />
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Upload CV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvUpload;
