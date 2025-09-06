import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchCompanyProfile,
  saveCompanyProfile,
  clearCompanyError,
  clearCompanySuccess,
} from "../../store/companySlice.js";

const selectAuth = createSelector(
  [(state) => state.auth],
  (auth) => ({
    userId: auth.userId || "",
  })
);

const CmpProfile = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector(selectAuth);
  const { profile, loading, error, success } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    industry: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    companySize: "",
    foundedYear: "",
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);

  // Fetch profile if user is authenticated
  useEffect(() => {
    if (userId) {
      dispatch(fetchCompanyProfile());
    }
  }, [dispatch, userId]);

  // Sync profile to form
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        description: profile.description || "",
        location: profile.location || "",
        industry: profile.industry || "",
        website: profile.website || "",
        contactEmail: profile.contactEmail || "",
        contactPhone: profile.contactPhone || "",
        companySize: profile.companySize || "",
        foundedYear: profile.foundedYear || "",
        logo: null,
      });
      setLogoPreview(profile.logo ? `http://localhost:5000/${profile.logo}` : null);
    }
  }, [profile]);

  // Handle success/error toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCompanyError());
    }
    if (success) {
      toast.success("Company profile saved successfully!");
      dispatch(clearCompanySuccess());
    }
  }, [error, success, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please upload a PNG or JPG file for the logo.");
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Logo file size must be under 5MB.");
      return;
    }
    setFormData((prev) => ({ ...prev, logo: file }));
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ["name", "description", "industry", "contactEmail"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill out required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Validate field lengths and formats
    if (formData.name.length < 3 || formData.name.length > 100) {
      toast.error("Company name must be 3-100 characters.");
      return;
    }
    if (formData.description.length > 1000) {
      toast.error("Description must be under 1000 characters.");
      return;
    }
    if (formData.website && !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/.*)?$/.test(formData.website)) {
      toast.error("Please enter a valid website URL (e.g., https://example.com).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      toast.error("Please enter a valid contact email.");
      return;
    }
    if (formData.contactPhone && !/^\+?[1-9]\d{1,14}$/.test(formData.contactPhone)) {
      toast.error("Please enter a valid contact phone number.");
      return;
    }
    if (
      formData.foundedYear &&
      (isNaN(formData.foundedYear) ||
        formData.foundedYear < 1800 ||
        formData.foundedYear > new Date().getFullYear())
    ) {
      toast.error(`Founded year must be between 1800 and ${new Date().getFullYear()}.`);
      return;
    }

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] && key !== "logo") {
        submissionData.append(key, formData[key]);
      }
    });
    if (formData.logo) submissionData.append("logo", formData.logo);

    dispatch(saveCompanyProfile(submissionData));
  };

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Hospitality",
    "BPO",
    "Logistics",
    "Other",
  ];
  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001+ employees",
  ];

  return (
    <section className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Company Profile
        </h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-blue-800"
              >
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                required
                aria-required="true"
                placeholder="e.g., Tech Corp"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-blue-800"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                rows="5"
                required
                aria-required="true"
                placeholder="Describe your company (max 1000 characters)"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-blue-800"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                placeholder="e.g., Mumbai, Maharashtra"
              />
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-semibold text-blue-800"
              >
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                required
                aria-required="true"
              >
                <option value="">Select an industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="website"
                className="block text-sm font-semibold text-blue-800"
              >
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                placeholder="e.g., https://yourcompany.com"
              />
            </div>

            <div>
              <label
                htmlFor="contactEmail"
                className="block text-sm font-semibold text-blue-800"
              >
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                required
                aria-required="true"
                placeholder="e.g., hr@yourcompany.com"
              />
            </div>

            <div>
              <label
                htmlFor="contactPhone"
                className="block text-sm font-semibold text-blue-800"
              >
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                placeholder="e.g., +91 9876543210"
              />
            </div>

            <div>
              <label
                htmlFor="companySize"
                className="block text-sm font-semibold text-blue-800"
              >
                Company Size
              </label>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
              >
                <option value="">Select company size</option>
                {companySizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="foundedYear"
                className="block text-sm font-semibold text-blue-800"
              >
                Founded Year
              </label>
              <input
                type="number"
                id="foundedYear"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3"
                placeholder="e.g., 2000"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="logo"
                className="block text-sm font-semibold text-blue-800"
              >
                Company Logo (PNG/JPG, max 5MB)
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                onChange={handleFileChange}
                accept="image/png,image/jpeg"
                className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="h-24 w-24 mt-4 object-contain rounded-md border border-blue-200"
                />
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-8 py-3 rounded-full text-white font-semibold transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
              aria-label="Save company profile"
            >
              {loading ? (
                <>
                  <BarLoader
                    width={24}
                    height={4}
                    color="#fff"
                    className="mr-2"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CmpProfile;