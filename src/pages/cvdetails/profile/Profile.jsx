import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadProfile } from "../../../store/profileSlice.js";
import { Link } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const { data: profile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(loadProfile()); // Load profile on refresh
  }, [dispatch]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!profile) return <p>No profile data available.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white flex items-center gap-4">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p>{profile.designation}</p>
            <p>{profile.company}</p>
            <p>{profile.location}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{profile.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p>{profile.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold">About</h3>
            <p>{profile.about}</p>
          </div>
        </div>

        <div className="p-6 border-t flex justify-between">
          <Link
            to="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/caddetails"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
