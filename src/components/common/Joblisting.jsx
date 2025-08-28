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
    // No token, redirect to login
    navigate("/login");
  }

  // 🔹 Axios instance with auth and error handling
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
    // Redirect to EmpPosting with job data
    navigate(`/empposting/${job.id}`, { state: job });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>

      {(user?.role === "admin" || user?.role === "employer") && (
        <Link
          to="/empposting"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
        >
          Add Job
        </Link>
      )}

      <ul>
        {Array.isArray(jobs) && jobs.length > 0 ? (
          jobs.map((job) => (
            <li
              key={job.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{job.title}</h2>
                <p>{job.description}</p>
                <p className="text-sm text-gray-600">
                  {job.location} | ${job.salary}
                </p>
              </div>

              {(user?.role === "admin" || user?.role === "employer") && (
                <div>
                  <button
                    onClick={() => handleEdit(job)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No jobs available.</p>
        )}
      </ul>
    </div>
  );
};

export default JobListing;
