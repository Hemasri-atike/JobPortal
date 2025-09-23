import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  fetchCompanyProfile,
  saveCompanyProfile,
  clearCompanyError,
  clearCompanySuccess,
} from "../../store/companySlice.js";
import { fetchUserInfo, logoutUser } from "../../store/userSlice.js";

const selectAuth = createSelector(
  [(state) => state.user],
  (user) => ({
    userInfo: user.userInfo || null,
    userType: user.userType || null,
    error: user.error || null,
  })
);

const CmpProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, userType, error: userError } = useSelector(selectAuth);
  const { profile, loading, error: companyError, success } = useSelector((state) => state.company);

  const [formData, setFormData] = useState({
    name: "",
    about: "",
    description: "",
    location: "",
    headquarters: "",
    industry: "",
    website: "",
    email: "",
    phone: "",
    employeeSize: "",
    established: "",
    socialLinks: { linkedin: "", twitter: "", facebook: "" },
    documents: [],
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    if (!userInfo && localStorage.getItem("token")) {
      dispatch(fetchUserInfo());
    }
    if (userInfo && userType === "employer") {
      dispatch(fetchCompanyProfile());
    }
  }, [dispatch, userInfo, userType]);

  useEffect(() => {
    if (userError) {
      toast.error(userError, { theme: "colored" });
      if (userError === "Invalid or expired token" || userError === "No token found") {
        dispatch(logoutUser());
        navigate("/login");
      }
    }
  }, [userError, dispatch, navigate]);

  useEffect(() => {
    const initialFormData = {
      name: userInfo?.company_name || userInfo?.name || "",
      about: "",
      description: "",
      location: "",
      headquarters: "",
      industry: "",
      website: "",
      email: userInfo?.email || "",
      phone: userInfo?.mobile || "",
      employeeSize: "",
      established: "",
      socialLinks: { linkedin: "", twitter: "", facebook: "" },
      documents: [],
    };

    if (profile) {
      setFormData({
        name: profile.name || initialFormData.name,
        about: profile.about || "",
        description: profile.description || "",
        location: profile.location || "",
        headquarters: profile.headquarters || "",
        industry: profile.industry || "",
        website: profile.website || "",
        email: profile.email || initialFormData.email,
        phone: profile.phone || initialFormData.phone,
        employeeSize: profile.employeeSize || "",
        established: profile.established || "",
        socialLinks: profile.socialLinks || initialFormData.socialLinks,
        documents: [], // Documents are not pre-filled in formData
      });
      setLogoPreview(profile.logo ? `http://localhost:5000/${profile.logo}` : null);
      setDocumentPreviews(
        profile.documents?.map((doc) => ({
          url: `http://localhost:5000/${doc.filePath}`,
          type: doc.type,
          status: doc.status,
        })) || []
      );
    } else {
      setFormData(initialFormData);
    }
  }, [profile, userInfo]);

  useEffect(() => {
    if (companyError) {
      toast.error(companyError, { theme: "colored" });
      dispatch(clearCompanyError());
    }
    if (success) {
      toast.success("Company profile saved successfully!", { theme: "colored" });
      dispatch(clearCompanySuccess());
    }
  }, [companyError, success, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please upload a PNG or JPG file for the logo.", { theme: "colored" });
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Logo file size must be under 5MB.", { theme: "colored" });
      return;
    }
    setFormData((prev) => ({ ...prev, logo: file }));
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleDocumentChange = (e, index) => {
    const file = e.target.files[0];
    if (file && !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please upload a PDF, JPG, or PNG file for the document.", {
        theme: "colored",
      });
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("Document file size must be under 10MB.", { theme: "colored" });
      return;
    }
    const newDocuments = [...formData.documents];
    newDocuments[index] = file;
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
    const newPreviews = [...documentPreviews];
    newPreviews[index] = { url: URL.createObjectURL(file), type: documentTypes[index] };
    setDocumentPreviews(newPreviews);
  };

  const handleDocumentTypeChange = (e, index) => {
    const newTypes = [...documentTypes];
    newTypes[index] = e.target.value;
    setDocumentTypes(newTypes);
  };

  const addDocumentField = () => {
    if (formData.documents.length >= 5) {
      toast.error("Maximum 5 documents allowed.", { theme: "colored" });
      return;
    }
    setFormData((prev) => ({ ...prev, documents: [...prev.documents, null] }));
    setDocumentTypes([...documentTypes, ""]);
    setDocumentPreviews([...documentPreviews, null]);
  };

  const removeDocumentField = (index) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index);
    const newTypes = documentTypes.filter((_, i) => i !== index);
    const newPreviews = documentPreviews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
    setDocumentTypes(newTypes);
    setDocumentPreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["name", "industry", "email"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill out required fields: ${missingFields.join(", ")}`, {
        theme: "colored",
      });
      return;
    }

    if (formData.name.length < 3 || formData.name.length > 100) {
      toast.error("Company name must be 3-100 characters.", { theme: "colored" });
      return;
    }
    if (formData.about && formData.about.length > 500) {
      toast.error("About section must be under 500 characters.", { theme: "colored" });
      return;
    }
    if (formData.description && formData.description.length > 1000) {
      toast.error("Description must be under 1000 characters.", { theme: "colored" });
      return;
    }
    if (formData.website && !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/.*)?$/.test(formData.website)) {
      toast.error("Please enter a valid website URL (e.g., https://example.com).", {
        theme: "colored",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid contact email.", { theme: "colored" });
      return;
    }
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      toast.error("Please enter a valid contact phone number.", { theme: "colored" });
      return;
    }
    if (
      formData.established &&
      (isNaN(formData.established) ||
        formData.established < 1800 ||
        formData.established > new Date().getFullYear())
    ) {
      toast.error(`Founded year must be between 1800 and ${new Date().getFullYear()}.`, {
        theme: "colored",
      });
      return;
    }
    for (const platform in formData.socialLinks) {
      if (
        formData.socialLinks[platform] &&
        !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/.*)?$/.test(formData.socialLinks[platform])
      ) {
        toast.error(`Please enter a valid ${platform} URL.`, { theme: "colored" });
        return;
      }
    }
    if (formData.documents.length > 0 && formData.documents.some((doc, i) => !documentTypes[i])) {
      toast.error("Please specify a type for each uploaded document.", { theme: "colored" });
      return;
    }

    dispatch(saveCompanyProfile({ formData, documentTypes }));
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
  const documentTypesOptions = [
    "business_registration",
    "gst_certificate",
    "pan_card",
    "proof_of_address",
    "ein",
  ];

  if (!userInfo) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Please log in to view your company profile
          </h2>
        </div>
      </section>
    );
  }

  if (userType !== "employer") {
    return (
      <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Access Denied</h2>
          <p className="text-center text-gray-600 mt-4">
            Only employers can access the company profile page.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Company Profile
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Basic Information</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  required
                  aria-required="true"
                  placeholder="e.g., Tech Corp"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700"
                >
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  rows="4"
                  placeholder="Brief overview of your company (max 500 characters)"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  rows="6"
                  required
                  aria-required="true"
                  placeholder="Detailed description of your company (max 1000 characters)"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>
              <div>
                <label
                  htmlFor="headquarters"
                  className="block text-sm font-medium text-gray-700"
                >
                  Headquarters
                </label>
                <input
                  type="text"
                  id="headquarters"
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  placeholder="e.g., Bangalore, Karnataka"
                />
              </div>
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
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
              <div>
                <label
                  htmlFor="employeeSize"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Size
                </label>
                <select
                  id="employeeSize"
                  name="employeeSize"
                  value={formData.employeeSize}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                >
                  <option value="">Select company size</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Contact Information</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  placeholder="e.g., https://yourcompany.com"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  required
                  aria-required="true"
                  placeholder="e.g., hr@yourcompany.com"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  placeholder="e.g., +91 9876543210"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Social Media</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-gray-600"
                >
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleSocialLinkChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  placeholder="e.g., https://linkedin.com/company/yourcompany"
                />
              </div>
              <div>
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-gray-600"
                >
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleSocialLinkChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  placeholder="e.g., https://twitter.com/yourcompany"
                />
              </div>
              <div>
                <label
                  htmlFor="facebook"
                  className="block text-sm font-medium text-gray-600"
                >
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleSocialLinkChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  placeholder="e.g., https://facebook.com/yourcompany"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Verification Documents</h3>
            <p className="text-sm text-gray-600">
              Upload documents to verify your company (PDF, JPG, PNG, max 10MB each, up to 5 documents).
            </p>
            {formData.documents.map((doc, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor={`documentType-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Document Type
                  </label>
                  <select
                    id={`documentType-${index}`}
                    value={documentTypes[index] || ""}
                    onChange={(e) => handleDocumentTypeChange(e, index)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition duration-200 ease-in-out"
                  >
                    <option value="">Select document type</option>
                    {documentTypesOptions.map((type) => (
                      <option key={type} value={type}>
                        {type
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={`document-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Document
                  </label>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor={`document-${index}`}
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16V8m0 0L3 12m4-4l4 4m6 4v6m-6-6h12"
                        />
                      </svg>
                      Choose File
                    </label>
                    <input
                      type="file"
                      id={`document-${index}`}
                      onChange={(e) => handleDocumentChange(e, index)}
                      accept="application/pdf,image/png,image/jpeg"
                      className="hidden"
                    />
                    {documentPreviews[index]?.url && (
                      <span className="ml-4 text-sm text-gray-600">
                        {documentPreviews[index].url.split("/").pop()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocumentField(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove document"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {documentPreviews.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
                <ul className="mt-2 space-y-2">
                  {documentPreviews.map(
                    (preview, index) =>
                      preview && (
                        <li key={index} className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-600">
                              {preview.type
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              (Status: {preview.status})
                            </span>
                          </div>
                          <a
                            href={preview.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </li>
                      )
                  )}
                </ul>
              </div>
            )}
            <button
              type="button"
              onClick={addDocumentField}
              className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Document
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700">Company Logo</h3>
            <div className="sm:col-span-2">
              <label
                htmlFor="logo"
                className="block text-sm font-medium text-gray-700"
              >
                Company Logo (PNG/JPG, max 5MB)
              </label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="logo"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V8m0 0L3 12m4-4l4 4m6 4v6m-6-6h12"
                    />
                  </svg>
                  Upload Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg"
                  className="hidden"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="ml-4 h-16 w-16 rounded-full object-cover border border-gray-200"
                  />
                )}
              </div>
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