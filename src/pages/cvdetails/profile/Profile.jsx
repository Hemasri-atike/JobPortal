import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../cvdetails/layout/Sidebar.jsx"; 
import Header from "../../navbar/Header.jsx"; 
import { fetchProfile, updateProfile, clearMessages } from "../../../store/profileSlice.js";

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, success } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Optional Header */}
      <Header />

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar className="w-full lg:w-64" />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">Candidate Profile</h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          {profile ? (
            <div className="bg-white p-4 rounded shadow">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              {/* <p><strong>Designation:</strong> {profile.designation}</p>
              <p><strong>Company:</strong> {profile.company}</p>
              <p><strong>Location:</strong> {profile.location}</p> */}
              <p><strong>About:</strong> {profile.about}</p>
            </div>
          ) : (
            <p>No profile found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
