// src/pages/EmpPosting.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addSkill, removeSkill } from "../../store/skillsSlice.js";
import { addJob } from "../../store/jobsSlice.js";
import statesAndCities from "../common/Statesncities.jsx";
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

  // Get token & decode user
  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Error decoding token:", err);
      localStorage.clear();
      navigate("/login?type=employee");
    }
  } else {
    navigate("/login?type=employee");
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
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login?type=employee");
      }
      return Promise.reject(error);
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() !== "") {
      dispatch(addSkill(skillInput.trim()));
      setSkillInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || (user.role !== "admin" && user.role !== "employer")) {
      alert("You are not authorized.");
      return;
    }

    const jobData = { ...formData, skills };

    try {
      const res = await axiosAuth.post("/jobs", jobData);
      dispatch(addJob(res.data));
      alert("Job posted successfully!");
      navigate("/joblistings");
    } catch (err) {
      console.error("Error posting job:", err);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Post a Job
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Job Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              placeholder="Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Company Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                placeholder="Google"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Job Role</label>
              <input
                type="text"
                name="role"
                placeholder="Software Engineer"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Job Category & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Job Category</label>
              <select
                name="jobCategory"
                value={formData.jobCategory}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="Junior">1-3 years</option>
                <option value="Mid">3-6 years</option>
                <option value="Senior">6+ years</option>
              </select>
            </div>
          </div>

          {/* State, City & Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value, city: "" })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select State</option>
                {Object.keys(statesAndCities).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!formData.state}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select City</option>
                {formData.state && statesAndCities[formData.state].map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Work Mode</label>
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

          {/* Job Type & Vacancies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Vacancies</label>
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
              <label className="block text-gray-700 font-medium mb-1">Min Salary</label>
              <input
                type="number"
                name="minSalary"
                placeholder="30000"
                value={formData.minSalary}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Max Salary</label>
              <input
                type="number"
                name="maxSalary"
                placeholder="80000"
                value={formData.maxSalary}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Required Skills</label>
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
            <div className="mt-2 flex flex-wrap gap-2">
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

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Job Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Enter detailed job description..."
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Contact & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                placeholder="HR Manager"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">End Date</label>
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
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Post Job
            </button>
          </div>

          {/* Back Link */}
          <p className="text-center text-gray-600 mt-4">
            Back to{" "}
            <Link to="/joblistings" className="text-blue-600 hover:underline font-medium">
              Job Listings
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default EmpPosting;
