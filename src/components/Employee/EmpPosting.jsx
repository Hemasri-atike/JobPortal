// src/pages/EmpPosting.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addSkill, removeSkill } from "../../store/skillsSlice.js"; // adjust path
import axios from "axios";

const EmpPosting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const skills = useSelector((state) => state.skills.list);

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    role: "",
    jobCategory: "",
    location: "",
    state: "",
    city: "",
    vacancies: "",
    jobType: "",
    workMode: "",
    experienceLevel: "",
    minSalary: "",
    maxSalary: "",
    description: "",
    contactPerson: "",
    startDate: "",
    endDate: "",
  });

  const [skillInput, setSkillInput] = useState("");

  // 🔹 Get token
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

  // 🔹 Axios instance
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

  // 🔹 Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 🔹 Add skill
  const handleAddSkill = () => {
    if (skillInput.trim() !== "") {
      dispatch(addSkill(skillInput.trim()));
      setSkillInput("");
    }
  };

  // 🔹 Enter key for adding skill
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || (user.role !== "admin" && user.role !== "employer")) {
      alert("You are not authorized.");
      return;
    }

    const jobData = {
      ...formData,
      skills,
    };

    try {
      await axiosAuth.post("/jobs", jobData);
      alert("Job posted successfully!");
      navigate("/jobs");
    } catch (err) {
      console.error("Error posting job:", err);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Post a Job
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Job Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Company Name + Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="e.g. Google"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Job Role
              </label>
              <input
                type="text"
                name="role"
                placeholder="e.g. Software Engineer"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Job Category + Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Job Category
              </label>
              <select
                name="jobCategory"
                value={formData.jobCategory}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select category</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Experience Category
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select experience</option>
                <option value="Fresher">Fresher</option>
                <option value="Junior">1-3 years</option>
                <option value="Mid">3-6 years</option>
                <option value="Senior">6+ years</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                placeholder="e.g. Telangana"
                value={formData.state}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Hyderabad"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Work Mode
              </label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Job Type + Vacancies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select job type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Number of Vacancies
              </label>
              <input
                type="number"
                name="vacancies"
                placeholder="e.g. 5"
                min="1"
                value={formData.vacancies}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Min Salary (per month)
              </label>
              <input
                type="number"
                name="minSalary"
                placeholder="e.g. 30000"
                value={formData.minSalary}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Max Salary (per month)
              </label>
              <input
                type="number"
                name="maxSalary"
                placeholder="e.g. 80000"
                value={formData.maxSalary}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Dynamic Skills */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Required Skills
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a skill and press Enter or +"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
              >
                +
              </button>
            </div>

            {/* Skill Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => dispatch(removeSkill(skill))}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Enter detailed job description..."
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              placeholder="e.g. HR Manager Name"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Application Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Application End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Post Job
            </button>
          </div>

          {/* Back link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Back to{" "}
              <Link
                to="/jobs"
                className="text-blue-600 hover:underline font-medium"
              >
                Job Listings
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpPosting;
