import React from "react";
import { Briefcase, PlusCircle, Users, Building } from "lucide-react";
import { Link } from "react-router-dom"; 
import Header from "../../pages/navbar/Header";
import SidebarMenu from "../../pages/cvdetails/layout/Sidebar";

const EmpDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-white shadow-lg">
          <SidebarMenu />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <main className="p-4 md:p-6 flex-1">
            {/* Dashboard Header */}
            <header className="flex flex-col md:flex-row justify-between items-center bg-white shadow rounded-lg p-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Employee Dashboard
              </h1>
              <Link
                to="/empposting" 
                className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Post a Job
              </Link>
            </header>

            {/* Dashboard Sections */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {/* Job Listings */}
              <div className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition">
                <Briefcase className="text-blue-500 w-10 h-10 mb-4" />
                <h2 className="text-lg font-semibold mb-2">Job Listings</h2>
                <p className="text-gray-600 mb-4">
                  Browse and view all job opportunities available in the system.
                </p>
                <button className="text-blue-600 hover:underline">
                  View Jobs →
                </button>
              </div>

              {/* Job Postings */}
              <div className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition">
                <PlusCircle className="text-green-500 w-10 h-10 mb-4" />
                <h2 className="text-lg font-semibold mb-2">Job Postings</h2>
                <p className="text-gray-600 mb-4">
                  Manage the jobs you have posted and edit details as needed.
                </p>
                <button className="text-green-600 hover:underline">
                  Manage Postings →
                </button>
              </div>

              {/* Applicants Management */}
              <div className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition">
                <Users className="text-purple-500 w-10 h-10 mb-4" />
                <h2 className="text-lg font-semibold mb-2">
                  Applicants Management
                </h2>
                <p className="text-gray-600 mb-4">
                  Review applications and contact potential candidates.
                </p>
                <button className="text-purple-600 hover:underline">
                  View Applicants →
                </button>
              </div>

              {/* Company Profile */}
              <div className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition">
                <Building className="text-orange-500 w-10 h-10 mb-4" />
                <h2 className="text-lg font-semibold mb-2">Company Profile</h2>
                <p className="text-gray-600 mb-4">
                  Update your company’s details, logo, and contact information.
                </p>
                <button className="text-orange-600 hover:underline">
                  Edit Profile →
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;
