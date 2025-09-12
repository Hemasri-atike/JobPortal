// src/pages/EmpPosting.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addSkill, removeSkill } from "../../store/skillsSlice.js";
import { addJob } from "../../store/jobsSlice.js";
import statesAndCities from "../common/Statesncities.jsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmpPosting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  console.log("state:", state);
  const skills = useSelector((state) => state.skills.list);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: state?.title || "",
    description: state?.description || "",
    company_name: state?.company_name || "",
    state: state?.location ? state.location.split(", ")[1] || "" : "",
    city: state?.location ? state.location.split(", ")[0] || "" : "",
    role: state?.role || "",
    jobCategory: state?.category || "",
    vacancies: state?.vacancies || "",
    jobType: state?.jobType || "",
    workMode: state?.type || "",
    experienceLevel: state?.experience || "",
    salary: state?.salary || "",
    contactPerson: state?.contactPerson || "",
    startDate: state?.startDate || "",
    endDate: state?.deadline || "",
  });
  console.log("formData:", formData);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Token and user setup
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

  if (user && user.role !== "admin" && user.role !== "employer") {
    toast.error("You are not authorized to post jobs.");
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
        navigate("/login?type=employee");
      }
      return Promise.reject(error);
    }
  );

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.description.trim()) newErrors.description = "Job description is required";
    if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";
    if (!formData.city || !formData.state) newErrors.location = "Both city and state are required";
    if (formData.salary && (isNaN(formData.salary) || parseFloat(formData.salary) < 0)) {
      newErrors.salary = "Salary must be a non-negative number";
    }
    if (formData.endDate && isNaN(Date.parse(formData.endDate))) {
      newErrors.endDate = "Invalid deadline format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "", location: "" });
  };

  // Handle skill input
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      console.log("Submission blocked: already submitting");
      return;
    }
    console.log("handleSubmit called with formData:", formData);
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }
    setIsSubmitting(true);
    const location = `${formData.city}, ${formData.state}`;
    const jobData = {
      title: formData.title,
      description: formData.description,
      location,
      company_name: formData.company_name,
      salary: formData.salary ? parseFloat(formData.salary) : null,
      status: formData.status || "Draft",
      tags: skills,
      category: formData.jobCategory || null,
      deadline: formData.endDate || null,
      type: formData.workMode || null,
      experience: formData.experienceLevel || null,
      role: formData.role || null,
      vacancies: formData.vacancies ? parseInt(formData.vacancies) : null,
      contactPerson: formData.contactPerson || null,
      startDate: formData.startDate || null,
    };
    try {
      if (isEditing) {
        await axiosAuth.patch(`/jobs/${id}`, jobData);
        toast.success("Job updated successfully!");
      } else {
        const res = await axiosAuth.post("/jobs", jobData);
        dispatch(addJob({ ...jobData, id: res.data.jobId }));
        toast.success("Job posted successfully!");
      }
      navigate("/joblistings");
    } catch (err) {
      console.error("Error posting/updating job:", err);
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {isEditing ? "Edit Job" : "Post a Job"}
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Job Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${errors.title ? "border-red-500" : ""}`}
              required
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Company Name */}
          <div>
            <label    className="block text-gray-700 font-medium mb-1" >
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company_name"
              placeholder="Google"
              value={formData.company_name}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${errors.company_name ? "border-red-500" : ""}`}
              required
            />
            {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
          </div>

          {/* State and City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value, city: "" })}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${errors.location ? "border-red-500" : ""}`}
                required
              >
                <option value="">Select State</option>
                {Object.keys(statesAndCities).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!formData.state}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${errors.location ? "border-red-500" : ""}`}
                required
              >
                <option value="">Select City</option>
                {formData.state && statesAndCities[formData.state].map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Enter detailed job description..."
              value={formData.description}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${errors.description ? "border-red-500" : ""}`}
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Salary */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Salary</label>
            <input
              type="number"
              name="salary"
              placeholder="50000"
              value={formData.salary}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${errors.salary ? "border-red-500" : ""}`}
              min="0"
            />
            {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
          </div>

          {/* Job Role */}
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

          {/* Work Mode */}
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
              <label className="block text-gray-700 font-medium mb-1">Deadline</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${errors.endDate ? "border-red-500" : ""}`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isEditing ? "Update Job" : "Post Job"}
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EmpPosting;