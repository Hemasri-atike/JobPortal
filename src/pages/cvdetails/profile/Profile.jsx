import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadProfile, updateProfile } from "../../../store/profileSlice.js";
import { Link } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const { data: profile, loading, error } = useSelector(
    (state) => state.profile
  );

  // Local state for editing (optional)
  const [editData, setEditData] = useState({});

  // Load profile from Redux (and localStorage)
  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  // Update editData when profile loads
  useEffect(() => {
    if (profile) setEditData(profile);
  }, [profile]);

  const handleUpdate = () => {
    dispatch(updateProfile(editData));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src="https://via.placeholder.com/120"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-sm">{profile?.designation}</p>
              <p className="text-sm">{profile?.company}</p>
              <p className="text-sm">{profile?.location}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Email</h3>
            <p className="text-gray-600">{profile?.email}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Phone</h3>
            <p className="text-gray-600">{profile?.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">About</h3>
            <p className="text-gray-600">{profile?.about}</p>
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
