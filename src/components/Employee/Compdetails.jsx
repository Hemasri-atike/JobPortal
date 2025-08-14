import React, { useState } from "react";
import { PencilIcon, LinkIcon, CheckIcon } from "@heroicons/react/24/outline"; // Replaced SaveIcon with CheckIcon
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Validation schema
const schema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  description: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
  }),
});

// Mock initial company data
const initialCompanyData = {
  name: "Tech Corp",
  logo: null,
  industry: "Technology",
  description: "Tech Corp is a leading innovator in software solutions, providing cutting-edge technology to empower businesses worldwide.",
  socialLinks: {
    linkedin: "https://linkedin.com/company/techcorp",
    twitter: "https://twitter.com/techcorp",
    website: "https://techcorp.com",
  },
};

const Compdetails = () => {
  const [company, setCompany] = useState(initialCompanyData);
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: company,
  });

  // Handle logo file upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      // Note: react-hook-form doesn't handle file inputs directly, so manage separately
    }
  };

  // Save changes
  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      logo: company.logo, // Preserve logo (handled separately)
    };
    setCompany(updatedData);
    setIsEditing(false);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    reset(updatedData);
    // TODO: Send updatedData to backend API (e.g., https://x.ai/api/company)
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    reset(company);
    setLogoPreview(company.logo ? (typeof company.logo === "string" ? company.logo : URL.createObjectURL(company.logo)) : null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Company Profile</h2>
          <button
            onClick={toggleEdit}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PencilIcon className="w-5 h-5 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                {...register("name")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter company name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="mt-2 h-20 w-20 object-contain rounded"
                />
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                {...register("industry")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
              </select>
              {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
            </div>

            {/* Company Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
              <textarea
                {...register("description")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter company description"
                rows="4"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Social Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    {...register("socialLinks.linkedin")}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://linkedin.com/company/..."
                  />
                  {errors.socialLinks?.linkedin && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.linkedin.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    {...register("socialLinks.twitter")}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://twitter.com/..."
                  />
                  {errors.socialLinks?.twitter && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.twitter.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    {...register("socialLinks.website")}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://yourcompany.com"
                  />
                  {errors.socialLinks?.website && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.website.message}</p>}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="text-right">
              <button
                type="submit"
                className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                <CheckIcon className="w-5 h-5 mr-2" /> {/* Replaced SaveIcon */}
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <h3 className="text-lg font-medium text-gray-700">Company Name</h3>
              <p className="text-gray-600">{company.name || "Not set"}</p>
            </div>

            {/* Logo */}
            <div>
              <h3 className="text-lg font-medium text-gray-700">Company Logo</h3>
              {company.logo ? (
                <img
                  src={typeof company.logo === "string" ? company.logo : URL.createObjectURL(company.logo)}
                  alt={`${company.name} Logo`}
                  className="h-20 w-20 object-contain rounded"
                />
              ) : (
                <p className="text-gray-600">No logo uploaded</p>
              )}
            </div>

            {/* Industry */}
            <div>
              <h3 className="text-lg font-medium text-gray-700">Industry</h3>
              <p className="text-gray-600">{company.industry || "Not set"}</p>
            </div>

            {/* Company Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-700">Company Description</h3>
              <p className="text-gray-600">{company.description || "Not set"}</p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-medium text-gray-700">Social Links</h3>
              <div className="space-y-2">
                {company.socialLinks.linkedin && (
                  <a
                    href={company.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <LinkIcon className="w-5 h-5 mr-2" />
                    LinkedIn
                  </a>
                )}
                {company.socialLinks.twitter && (
                  <a
                    href={company.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Twitter
                  </a>
                )}
                {company.socialLinks.website && (
                  <a
                    href={company.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Website
                  </a>
                )}
                {!company.socialLinks.linkedin &&
                  !company.socialLinks.twitter &&
                  !company.socialLinks.website && (
                    <p className="text-gray-600">No social links provided</p>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compdetails;