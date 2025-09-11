import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {    fetchProfile,updateProfile, loadProfile } from "../redux/profileSlice";
import { useNavigate } from "react-router-dom";


const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: profile, loading } = useSelector((state) => state.profile);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    company: "",
    location: "",
    about: "",
  });

  // Load existing profile into form
  useEffect(() => {
    if (!profile) {
      dispatch(loadProfile());
    } else {
      setForm(profile);
    }
  }, [profile, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(form));
    navigate("/profile"); // Go back to Profile page after saving
  };

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Designation</label>
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Company</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">About</label>
              <textarea
                name="about"
                value={form.about}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
