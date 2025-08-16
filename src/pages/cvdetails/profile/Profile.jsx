import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 9876543210",
    designation: "Senior Software Engineer",
    company: "Tech Solutions Pvt Ltd",
    location: "Hyderabad, India",
    about:
      "Passionate software engineer with 5+ years of experience in full-stack development and team management.",
  });

  // Load profile data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("candidateProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Update profile data (e.g., after editing)
  const updateProfile = (updatedData) => {
    setProfile((prev) => {
      const newProfile = { ...prev, ...updatedData };
      localStorage.setItem("candidateProfile", JSON.stringify(newProfile));
      return newProfile;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src="https://via.placeholder.com/120"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-sm">{profile.designation}</p>
              <p className="text-sm">{profile.company}</p>
              <p className="text-sm">{profile.location}</p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Email</h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Phone</h3>
            <p className="text-gray-600">{profile.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">About</h3>
            <p className="text-gray-600">{profile.about}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t flex justify-between">
          <Link
            to="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/caddetails"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;