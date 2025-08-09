import React from "react";

const Profile = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Profile Card */}
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        {/* Profile Image & Name */}
        <div className="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Hemasri Atike</h2>
          <p className="text-gray-500">Java Developer</p>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">hemasri@example.com</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Location</p>
              <p className="font-medium">Hyderabad, India</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Experience</p>
              <p className="font-medium">2 Years</p>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">About Me</h3>
          <p className="mt-2 text-gray-600 text-sm">
            I am a passionate Java developer with expertise in building scalable web applications,
            backend APIs, and working on modern JavaScript frameworks like React.js.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
            Edit Profile
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300">
            Upload CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
