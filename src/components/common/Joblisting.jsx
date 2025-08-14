import React, { useState } from "react";
import { State } from "country-state-city";
import { Briefcase, MapPin } from "lucide-react"; 
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";

// Validation schema for job form
const schema = z.object({
  title: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  status: z.enum(["Open", "Closed", "Draft"], { message: "Status is required" }),
});

// Mock job data (replace with API data)
const jobsDummy = [
  {
    id: "101",
    title: "Frontend Developer",
    company: "TCS",
    location: "Maharashtra",
    status: "Open",
    description: "Develop and maintain web applications using React.",
    applicants: 25,
  },
  {
    id: "102",
    title: "Backend Developer",
    company: "Infosys",
    location: "Karnataka",
    status: "Closed",
    description: "Build scalable APIs with Node.js and Express.",
    applicants: 10,
  },
  {
    id: "103",
    title: "UI/UX Designer",
    company: "Wipro",
    location: "Delhi",
    status: "Draft",
    description: "Design user-friendly interfaces for enterprise software.",
    applicants: 0,
  },
];

const Joblisting = () => {
  const [jobs, setJobs] = useState(jobsDummy);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "", location: "", description: "", status: "Open" },
  });

  // Filter jobs by location and status
  const filteredJobs = jobs.filter((job) =>
    (locationFilter ? job.location === locationFilter : true) &&
    (statusFilter ? job.status === statusFilter : true)
  );

  // Handle job creation or update
  const onSubmit = (data) => {
    if (editingJobId) {
      // Edit existing job
      setJobs(
        jobs.map((job) =>
          job.id === editingJobId ? { ...job, ...data } : job
        )
      );
      setEditingJobId(null);
    } else {
      // Add new job
      const newJob = {
        id: String(jobs.length + 101), // Simple ID generation
        ...data,
        company: "TCS", // Replace with dynamic company from Compdetails
        applicants: 0,
      };
      setJobs([...jobs, newJob]);
    }
    setIsAdding(false);
    reset();
  };

  // Handle edit job
  const handleEdit = (job) => {
    setIsAdding(true);
    setEditingJobId(job.id);
    setValue("title", job.title);
    setValue("location", job.location);
    setValue("description", job.description);
    setValue("status", job.status);
  };

  // Handle delete job
  const handleDelete = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">
            Manage Job Postings
          </h1>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingJobId(null);
              reset({ title: "", location: "", description: "", status: "Open" });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add New Job
          </button>
        </div>

        {/* Add/Edit Job Form */}
        {isAdding && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingJobId ? "Edit Job" : "Add New Job"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  {...register("title")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter job title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  {...register("location")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Location</option>
                  {State.getStatesOfCountry("IN").map(({ name }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register("description")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter job description"
                  rows="4"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  {...register("status")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingJobId(null);
                    reset();
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {editingJobId ? "Update Job" : "Add Job"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center gap-4">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full sm:w-1/3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">🌍 All Locations</option>
            {State.getStatesOfCountry("IN").map(({ name }) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-1/3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Draft">Draft</option>
          </select>
          {(locationFilter || statusFilter) && (
            <button
              onClick={() => {
                setLocationFilter("");
                setStatusFilter("");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Job Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    {job.title}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      job.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : job.status === "Closed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <p className="text-gray-500 flex items-center gap-1 mb-2">
                  <MapPin className="w-4 h-4" /> {job.location}
                </p>
                <p className="text-gray-500 mb-3">Applicants: {job.applicants}</p>
                <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                <div className="flex gap-2">
                  <Link
                    to={`/applicants/${job.id}`}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <EyeIcon className="w-5 h-5 mr-2" />
                    View Applicants
                  </Link>
                  <button
                    onClick={() => handleEdit(job)}
                    className="flex items-center bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
                  >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-2">No jobs found for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Joblisting;