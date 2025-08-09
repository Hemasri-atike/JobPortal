import React from "react";
import Header from "../../navbar/Header";
import Sidebar from "../layout/Sidebar";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar and Profile */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar className="w-full lg:w-64 p-4 bg-white shadow-lg" />

        {/* Profile Container */}
        <div className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
          <h5 className="text-2xl font-semibold text-gray-800 mb-6">My Profile</h5>

          {/* Profile Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Personal Information */}
            <div className="mb-6">
              <h6 className="text-lg font-medium text-gray-700 mb-4">
                Personal Information
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h6 className="text-lg font-medium text-gray-700 mb-4">Education</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="e.g., B.Tech"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    University
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="e.g., XYZ University"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="e.g., 2020"
                  />
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="mb-6">
              <h6 className="text-lg font-medium text-gray-700 mb-4">
                Work Experience
              </h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="e.g., ABC Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="e.g., 2019 - 2023"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h6 className="text-lg font-medium text-gray-700 mb-4">Skills</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skill 1
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="e.g., JavaScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skill 2
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="e.g., React"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button className="w-full sm:w-auto bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;