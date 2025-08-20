import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // 🔹 Decode token to get user info
  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }

  // 🔹 Fetch jobs from backend
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs");
      // ✅ Ensure jobs is always an array
      setJobs(Array.isArray(res.data.jobs) ? res.data.jobs : res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]); // fallback to empty
    }
  };

  // 🔹 Handle Add / Edit Job
  const onSubmit = async (data) => {
    if (!user || (user.role !== "admin" && user.role !== "employer")) {
      alert("You are not authorized to perform this action.");
      return;
    }

    try {
      if (editingJobId) {
        // Update job
        await axios.put(
          `http://localhost:5000/api/jobs/${editingJobId}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create job
        await axios.post("http://localhost:5000/api/jobs", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchJobs(); // Refresh jobs
      setIsAdding(false);
      setEditingJobId(null);
      reset();
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  // 🔹 Handle Delete Job
  const handleDelete = async (id) => {
    if (!user || (user.role !== "admin" && user.role !== "employer")) {
      alert("You are not authorized to delete jobs.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs(); // Refresh jobs
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  // 🔹 Handle Edit Job (prefill form)
  const handleEdit = (job) => {
    setEditingJobId(job.id);
    setIsAdding(true);
    setValue("title", job.title);
    setValue("description", job.description);
    setValue("location", job.location || "");
    setValue("salary", job.salary || "");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>

      {/* Add Job Button */}
      {(user?.role === "admin" || user?.role === "employer") && (
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingJobId(null);
            reset();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Job
        </button>
      )}

      {/* Job Form */}
      {isAdding && (user?.role === "admin" || user?.role === "employer") && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 bg-gray-100 p-4 rounded"
        >
          <input
            {...register("title", { required: true })}
            placeholder="Job Title"
            className="block w-full mb-2 p-2 border rounded"
          />
          {errors.title && <p className="text-red-500">Title is required</p>}

          <textarea
            {...register("description", { required: true })}
            placeholder="Job Description"
            className="block w-full mb-2 p-2 border rounded"
          />
          {errors.description && (
            <p className="text-red-500">Description is required</p>
          )}

          <input
            {...register("location")}
            placeholder="Location"
            className="block w-full mb-2 p-2 border rounded"
          />

          <input
            {...register("salary")}
            placeholder="Salary"
            className="block w-full mb-2 p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {editingJobId ? "Update Job" : "Save Job"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              reset();
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Jobs List */}
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

              {/* Edit/Delete buttons */}
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
