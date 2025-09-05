// src/pages/JobListing.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const navigate = useNavigate();

  // Token and user setup
  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Error decoding token:", err);
      localStorage.clear();
      navigate("/login");
    }
  } else {
    navigate("/login");
  }

  if (user && user.role !== "employer" && user.role !== "admin") {
    toast.error("You are not authorized to view this page.");
    navigate("/");
  }

  // Axios instance
  const axiosAuth = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  axiosAuth.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const res = await axiosAuth.get("/jobs/categories");
        setCategories(res.data);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load categories.");
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch jobs
  useEffect(() => {
    fetchJobs();
  }, [page, searchTerm, statusFilter, categoryFilter, sortBy]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await axiosAuth.get("/jobs", {
        params: { page, limit, search: searchTerm, status: statusFilter, category: categoryFilter, sortBy },
      });
      console.log("API Response:", res.data);
      setJobs(res.data.jobs || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Fetch Jobs Error:", err.response?.data);
      toast.error(err.response?.data?.error || "Failed to load jobs.");
      setJobs([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job actions
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosAuth.delete(`/jobs/${id}`);
      fetchJobs();
      setSelectedJobs((prev) => prev.filter((jobId) => id !== jobId));
      toast.success("Job deleted successfully.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete job.");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedJobs.length} job(s)?`)) return;
    try {
      await axiosAuth.post("/jobs/bulk-delete", { jobIds: selectedJobs });
      fetchJobs();
      setSelectedJobs([]);
      toast.success(`${selectedJobs.length} job(s) deleted successfully.`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete jobs.");
    }
  };

  const handleEdit = (job) => {
    navigate(`/empposting/${job.id}`, { state: job });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Closed" : "Active";
      await axiosAuth.patch(`/jobs/${id}`, { status: newStatus });
      fetchJobs();
      toast.success(`Job status updated to ${newStatus}.`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update job status.");
    }
  };

  // Pagination
  const totalPages = Math.ceil(total / limit);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Deadline check
  const isDeadlineApproaching = (deadline) => {
    if (!deadline) return false;
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft > 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Your Job Postings
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Manage your job listings. Ensure jobs include a title, description, location, and company name when creating or editing.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-4">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {viewMode === "grid" ? "Table View" : "Grid View"}
            </button>
            <Link
              to="/empposting"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Post New Job
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search jobs by title, description, or company..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
            <option value="Draft">Draft</option>
            <option value="Pending Review">Pending Review</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            disabled={isCategoriesLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">All Categories</option>
            {isCategoriesLoading ? (
              <option>Loading...</option>
            ) : (
              categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            )}
          </select>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="applicantCount-desc">Most Applicants</option>
            <option value="applicantCount-asc">Fewest Applicants</option>
            <option value="views-desc">Most Views</option>
            <option value="views-asc">Fewest Views</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedJobs.length > 0 && (
          <div className="mb-4 flex gap-4">
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Selected ({selectedJobs.length})
            </button>
          </div>
        )}

        {/* Job Listings */}
        {isLoading ? (
          <div className="text-center py-12">
            <svg className="animate-spin mx-auto h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="mt-4 text-gray-500">Loading your jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job.id)}
                          onChange={() =>
                            setSelectedJobs((prev) =>
                              prev.includes(job.id) ? prev.filter((id) => id !== job.id) : [...prev, job.id]
                            )
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-2">{job.title}</h2>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          job.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : job.status === "Closed"
                            ? "bg-gray-100 text-gray-800"
                            : job.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-semibold">
                      {job.company_name} • {job.location}
                    </p>
                    <p className="text-gray-600 mt-3 line-clamp-3" title={job.description}>
                      {job.description}
                    </p>
                    <div className="mt-4 text-sm text-gray-600 space-y-2">
                      <p><span className="font-semibold">Category:</span> {job.category || "Not specified"}</p>
                      <p><span className="font-semibold">Salary:</span> ${job.salary?.toLocaleString() || "Not disclosed"}</p>
                      <p><span className="font-semibold">Type:</span> {job.type || "Not specified"}</p>
                      <p><span className="font-semibold">Experience:</span> {job.experience || "Not specified"}</p>
                      <p><span className="font-semibold">Applicants:</span> {job.applicantCount || 0}</p>
                      <p><span className="font-semibold">Views:</span> {job.views || 0}</p>
                      <p>
                        <span className="font-semibold">Deadline:</span>{" "}
                        {job.deadline
                          ? new Date(job.deadline).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "No deadline"}
                        {job.deadline && isDeadlineApproaching(job.deadline) && (
                          <span className="ml-2 text-red-600 text-xs">(Approaching)</span>
                        )}
                      </p>
                      <p>
                        <span className="font-semibold">Posted:</span>{" "}
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Tags:</span>{" "}
                        {job.tags?.length > 0 ? job.tags.join(", ") : "None"}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to={`/jobs/${job.id}/applicants`}
                        className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        View Applicants ({job.applicantCount || 0})
                      </Link>
                      <button
                        onClick={() => handleEdit(job)}
                        className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 font-medium rounded-lg hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {job.status === "Active" ? "Close Job" : "Reopen Job"}
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedJobs.length === jobs.length && jobs.length > 0}
                          onChange={() =>
                            setSelectedJobs(selectedJobs.length === jobs.length ? [] : jobs.map((job) => job.id))
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedJobs.includes(job.id)}
                            onChange={() =>
                              setSelectedJobs((prev) =>
                                prev.includes(job.id) ? prev.filter((id) => id !== job.id) : [...prev, job.id]
                              )
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{job.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-medium">{job.company_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-medium">{job.location}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 line-clamp-2" title={job.description}>
                          {job.description}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              job.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : job.status === "Closed"
                                ? "bg-gray-100 text-gray-800"
                                : job.status === "Draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{job.applicantCount || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{job.views || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {job.deadline
                            ? new Date(job.deadline).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "No deadline"}
                          {job.deadline && isDeadlineApproaching(job.deadline) && (
                            <span className="ml-2 text-red-600 text-xs">(Approaching)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Link
                              to={`/jobs/${job.id}/applicants`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              Applicants
                            </Link>
                            <button
                              onClick={() => handleEdit(job)}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(job.id, job.status)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {job.status === "Active" ? "Close" : "Reopen"}
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-500">
              No jobs found. {searchTerm || statusFilter !== "All" || categoryFilter
                ? "Try adjusting your filters or post a new job with a title, description, location, and company name."
                : "You haven't posted any jobs yet. Start by creating one with a title, description, location, and company name!"}
            </p>
            <Link
              to="/empposting"
              className="mt-4 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Post Your First Job
            </Link>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default JobListing;