import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCompany, updateCompany } from "../../store/companySlice.js";
import { PencilIcon, CheckIcon, MapPinIcon, LinkIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";

const industries = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail"];

const Compdetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { company, loading, error } = useSelector((state) => state.company);

  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm({ defaultValues: {} });

  // Fetch company from Redux
  useEffect(() => {
    if (id) dispatch(fetchCompany(id));
  }, [id, dispatch]);

  // Populate form when company data arrives
  useEffect(() => {
    if (company) {
      // Parse socialLinks if it's a string
      const social = typeof company.socialLinks === "string"
        ? JSON.parse(company.socialLinks)
        : company.socialLinks || {};
      reset({ ...company, socialLinks: social });
      setLogoPreview(company.logo);
    }
  }, [company, reset]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (company) {
      const social = typeof company.socialLinks === "string"
        ? JSON.parse(company.socialLinks)
        : company.socialLinks || {};
      reset({ ...company, socialLinks: social });
      setLogoPreview(company.logo);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setValue("logo", url);
    }
  };

  const onSubmit = (data) => {
    // Ensure socialLinks is JSON
    if (data.socialLinks && typeof data.socialLinks !== "string") {
      data.socialLinks = JSON.stringify(data.socialLinks);
    }
    dispatch(updateCompany({ id, data }));
    setIsEditing(false);
  };

  if (loading) return <p className="text-center mt-10">Loading company...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!company) return <p className="text-center mt-10">No company found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Company Profile</h2>
          <button
            onClick={toggleEdit}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PencilIcon className="w-5 h-5 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <input {...register("name")} placeholder="Company Name" className="w-full p-2 border rounded" />
            <select {...register("industry")} className="w-full p-2 border rounded">
              <option value="">Select Industry</option>
              {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
            <textarea {...register("about")} placeholder="About" className="w-full p-2 border rounded" rows={3} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input {...register("location")} placeholder="Location" className="p-2 border rounded" />
              <input {...register("website")} placeholder="Website" className="p-2 border rounded" />
              <input {...register("email")} placeholder="Email" className="p-2 border rounded" />
              <input {...register("phone")} placeholder="Phone" className="p-2 border rounded" />
            </div>

            <div>
              <label>Social Links</label>
              {["linkedin", "twitter", "website"].map((key) => (
                <input
                  key={key}
                  {...register(`socialLinks.${key}`)}
                  placeholder={key}
                  className="w-full p-2 border rounded my-1"
                />
              ))}
            </div>

            <div>
              <label>Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              {logoPreview && <img src={logoPreview} alt="Logo" className="h-20 w-20 mt-2" />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input {...register("description")} placeholder="Description" className="p-2 border rounded" />
              <input {...register("established")} placeholder="Established Year" className="p-2 border rounded" />
              <input {...register("headquarters")} placeholder="Headquarters" className="p-2 border rounded" />
              <input {...register("employeeSize")} placeholder="Employee Size" className="p-2 border rounded" />
            </div>

            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex items-center">
              <CheckIcon className="w-5 h-5 mr-1" /> Save
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {company.logo && <img src={company.logo} alt="Logo" className="h-20 w-20 object-contain" />}
            <h3 className="text-xl font-semibold">{company.name}</h3>
            <p>{company.industry}</p>
            <p>{company.about}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p><MapPinIcon className="inline w-5 h-5" /> {company.location || "N/A"}</p>
              <p><LinkIcon className="inline w-5 h-5" /> {company.website || "N/A"}</p>
              <p><UsersIcon className="inline w-5 h-5" /> {company.phone || "N/A"}</p>
              <p>Email: {company.email || "N/A"}</p>
            </div>

            <div>
              {Object.entries(company.socialLinks || {}).map(([key, value]) =>
                value ? <p key={key}><LinkIcon className="inline w-5 h-5" /> {key}: {value}</p> : null
              )}
            </div>

            <p>Description: {company.description || "N/A"}</p>
            <p>Established: {company.established || "N/A"}</p>
            <p>Headquarters: {company.headquarters || "N/A"}</p>
            <p>Employees: {company.employeeSize || "N/A"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compdetails;
