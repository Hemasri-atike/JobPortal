import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PencilIcon,
  LinkIcon,
  CheckIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  about: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
  }),
});

const Compdetails = () => {
  const { id } = useParams(); // Company ID from route
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  // Fetch company by ID
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/companies/${id}`);
        setCompany(res.data);
        reset(res.data);
        if (res.data.logo) setLogoPreview(res.data.logo);
      } catch (err) {
        console.error("Error fetching company:", err);
      }
    };
    if (id) fetchCompany();
  }, [id, reset]);

  // Handle logo preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Submit updated data
  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        logo: company.logo, // keep existing logo
      };
      const res = await axios.put(
        `http://localhost:5000/api/companies/${id}`,
        updatedData
      );
      setCompany(res.data);
      setIsEditing(false);
      reset(res.data);
    } catch (err) {
      console.error("Error updating company:", err);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    reset(company);
  };

  if (!company) return <p className="text-center text-gray-500">Loading company...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Header */}
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
          // ===== EDIT FORM =====
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                {...register("name")}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter company name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium mb-1">Company Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full p-3 border rounded-lg" />
              {logoPreview && (
                <img src={logoPreview} alt="Logo Preview" className="mt-2 h-20 w-20 object-contain rounded" />
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <select {...register("industry")} className="w-full p-3 border rounded-lg">
                <option value="">Select Industry</option>
                <option>Technology</option>
                <option>Finance</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>Manufacturing</option>
                <option>Retail</option>
              </select>
              {errors.industry && <p className="text-red-500 text-sm">{errors.industry.message}</p>}
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium mb-1">About</label>
              <textarea {...register("about")} className="w-full p-3 border rounded-lg" rows="4" />
            </div>

            {/* Location, Website, Email, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input {...register("location")} placeholder="Location" className="w-full p-2 border rounded-lg" />
              <input {...register("website")} placeholder="Website" className="w-full p-2 border rounded-lg" />
              <input {...register("email")} placeholder="Email" className="w-full p-2 border rounded-lg" />
              <input {...register("phone")} placeholder="Phone" className="w-full p-2 border rounded-lg" />
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium mb-1">Social Links</label>
              <input {...register("socialLinks.linkedin")} placeholder="LinkedIn" className="w-full p-2 border rounded-lg my-1" />
              <input {...register("socialLinks.twitter")} placeholder="Twitter" className="w-full p-2 border rounded-lg my-1" />
              <input {...register("socialLinks.website")} placeholder="Website" className="w-full p-2 border rounded-lg my-1" />
            </div>

            {/* Save Button */}
            <div className="text-right">
              <button type="submit" className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                <CheckIcon className="w-5 h-5 mr-2" /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          // ===== VIEW MODE =====
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {company.logo ? (
                <img src={company.logo} alt="Company Logo" className="h-20 w-20 object-contain rounded" />
              ) : (
                <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-gray-500">No Logo</div>
              )}
              <div>
                <h3 className="text-xl font-semibold">{company.name}</h3>
                <p className="text-gray-600">{company.industry}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">About Us</h3>
              <p className="text-gray-600">{company.about || "No description"}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 text-gray-500 mr-2" />
                <p>{company.location || "N/A"}</p>
              </div>
              <div className="flex items-center">
                <LinkIcon className="w-5 h-5 text-gray-500 mr-2" />
                <p>{company.website || "N/A"}</p>
              </div>
              <div className="flex items-center">
                <UsersIcon className="w-5 h-5 text-gray-500 mr-2" />
                <p>{company.phone || "N/A"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Social Links</h3>
              <div className="space-y-2">
                {company.socialLinks?.linkedin && (
                  <a href={company.socialLinks.linkedin} className="flex items-center text-blue-600 hover:underline">
                    <LinkIcon className="w-5 h-5 mr-2" /> LinkedIn
                  </a>
                )}
                {company.socialLinks?.twitter && (
                  <a href={company.socialLinks.twitter} className="flex items-center text-blue-600 hover:underline">
                    <LinkIcon className="w-5 h-5 mr-2" /> Twitter
                  </a>
                )}
                {company.socialLinks?.website && (
                  <a href={company.socialLinks.website} className="flex items-center text-blue-600 hover:underline">
                    <LinkIcon className="w-5 h-5 mr-2" /> Website
                  </a>
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
