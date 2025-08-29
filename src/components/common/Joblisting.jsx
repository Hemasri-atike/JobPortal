// src/pages/JobListing.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // 🔹 Get token
  const token = localStorage.getItem("token");

  // 🔹 Decode token safely
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
    navigate("/login"); // no token → redirect
  }

  // 🔹 Axios instance with auth
  const axiosAuth = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  axiosAuth.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  // 🔹 Fetch jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axiosAuth.get("/jobs");
      setJobs(Array.isArray(res.data.jobs) ? res.data.jobs : res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    }
  };

  const handleDelete = async (id) => {
    if (!user || (user.role !== "admin" && user.role !== "employer")) {
      alert("You are not authorized.");
      return;
    }
    try {
      await axiosAuth.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleEdit = (job) => {
    navigate(`/empposting/${job.id}`, { state: job });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Job Listings</h1>

      {(user?.role === "admin" || user?.role === "employer") && (
        <Link
          to="/empposting"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow mb-6 inline-block"
        >
          + Post a Job
        </Link>
      )}

      {/* Jobs Grid */}
      {Array.isArray(jobs) && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {job.title}
              </h2>
              <p className="text-gray-700 mb-3">{job.description}</p>

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {job.location}
                </p>
                <p>
                  <span className="font-semibold">Salary:</span> ${job.salary}
                </p>
                <p>
                  <span className="font-semibold">Type:</span> {job.type}
                </p>
                <p>
                  <span className="font-semibold">Experience:</span>{" "}
                  {job.experience || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Posted By:</span>{" "}
                  {job.companyName || "Unknown"}
                </p>
                <p>
                  <span className="font-semibold">Posted On:</span>{" "}
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {/* Action Buttons */}
              {(user?.role === "admin" || user?.role === "employer") && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(job)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg mt-6">No jobs available.</p>
      )}
    </div>
  );
};

export default JobListing;
