import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, GraduationCap, Briefcase, MapPin, Upload } from "lucide-react";
import Sidebar from "../../pages/cvdetails/layout/Sidebar.jsx";
import Header from "../../pages/navbar/Header.jsx";
import { loadCandidate, saveCandidate, clearCandidateMessages } from "../../store/candidateSlice.js";
import statesWithCities from "../common/Statesncities.jsx";

const CandidateDetails = ({ candidateId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, success, error } = useSelector((state) => state.candidate);
  const { userInfo } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    graduationDegree: "",
    graduationState: "",
    graduationCity: "",
    graduationUniversity: "",
    graduationCollege: "",
    graduationYear: "",
    interBoard: "",
    interState: "",
    interStateBoard: "",
    interCity: "",
    interCollege: "",
    interStream: "",
    interYear: "",
    tenthBoard: "",
    tenthState: "",
    tenthCity: "",
    tenthSchool: "",
    tenthYear: "",
    experience: "",
    companyName: "",
    jobTitle: "",
    duration: "",
    responsibilities: "",
    currentLocation: "",
    preferredLocation: "",
    resume: null,
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect to login if not job_seeker
  useEffect(() => {
    if (!userInfo || userInfo?.role !== "job_seeker") {
      navigate("/login?type=candidate", { replace: true });
    }
  }, [userInfo, navigate]);

  // Load candidate data
  useEffect(() => {
    if (candidateId && userInfo?.role === "job_seeker") {
      dispatch(loadCandidate(candidateId));
    }
    return () => dispatch(clearCandidateMessages());
  }, [candidateId, dispatch, userInfo]);

  // Merge backend data safely
  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...Object.fromEntries(Object.entries(data).map(([key, val]) => [key, val ?? ""])),
        resume: null, // Reset file input to avoid invalid file objects
      }));
    }
  }, [data]);

  // Validate form fields
  const validateStep = () => {
    const errors = {};
    if (step === 1) {
      if (!formData.name) errors.name = "Full Name is required";
      if (!formData.email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
      if (!formData.phone) errors.phone = "Phone is required";
      else if (!/^\d{10}$/.test(formData.phone)) errors.phone = "Phone must be 10 digits";
    } else if (step === 2) {
      if (!formData.graduationDegree) errors.graduationDegree = "Degree is required";
      if (!formData.graduationState) errors.graduationState = "State is required";
      if (!formData.graduationCity) errors.graduationCity = "City is required";
      if (!formData.graduationYear) errors.graduationYear = "Year is required";
    } else if (step === 5) {
      if (!formData.resume) errors.resume = "Resume is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear error on change
  };

  const handleNext = () => {
    if (validateStep() && step < 5) setStep(step + 1);
  };

  const handlePrev = () => step > 1 && setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        payload.append(key, val ?? "");
      });
      dispatch(saveCandidate(payload));
    }
  };

  const steps = [
    { label: "Personal", icon: <User className="w-5 h-5" /> },
    { label: "Education", icon: <GraduationCap className="w-5 h-5" /> },
    { label: "Experience", icon: <Briefcase className="w-5 h-5" /> },
    { label: "Location", icon: <MapPin className="w-5 h-5" /> },
    { label: "Resume", icon: <Upload className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-gray-700 text-lg font-medium animate-pulse">
            Loading your details…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <Sidebar role="job_seeker" />
        </aside>

        {/* Form Content */}
        <main className="flex-1">
          {/* Header Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Complete Your Profile
            </h1>
            <p className="mt-1 text-gray-600 text-sm">
              Provide your details to enhance your job applications.
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map(({ label, icon }, index) => (
                <div key={label} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                      step === index + 1
                        ? "bg-blue-600 text-white shadow-lg scale-110"
                        : step > index + 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {icon}
                  </div>
                  <p className={`mt-2 text-sm font-medium ${step === index + 1 ? "text-blue-600" : "text-gray-500"}`}>
                    {label}
                  </p>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-6 left-1/2 w-full h-1 -z-10 ${
                        step > index + 1 ? "bg-green-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={`border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-required="true"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={`border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-required="true"
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone (10 digits)"
                    className={`border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-required="true"
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Graduation */}
                <div className="p-4 border border-gray-100 rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Graduation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="graduationDegree" className="block text-sm font-medium text-gray-700 mb-1">
                        Degree <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="graduationDegree"
                        name="graduationDegree"
                        value={formData.graduationDegree}
                        onChange={handleChange}
                        placeholder="Degree"
                        className={`border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          formErrors.graduationDegree ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-required="true"
                      />
                      {formErrors.graduationDegree && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.graduationDegree}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="graduationState" className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="graduationState"
                        name="graduationState"
                        value={formData.graduationState}
                        onChange={handleChange}
                        className={`border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          formErrors.graduationState ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-required="true"
                      >
                        <option value="">Select State</option>
                        {Object.keys(statesWithCities).map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {formErrors.graduationState && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.graduationState}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="graduationCity" className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="graduationCity"
                        name="graduationCity"
                        value={formData.graduationCity}
                        onChange={handleChange}
                        className={`border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          formErrors.graduationCity ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-required="true"
                      >
                        <option value="">Select City</option>
                        {statesWithCities[formData.graduationState]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {formErrors.graduationCity && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.graduationCity}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="graduationUniversity" className="block text-sm font-medium text-gray-700 mb-1">
                        University
                      </label>
                      <input
                        id="graduationUniversity"
                        name="graduationUniversity"
                        value={formData.graduationUniversity}
                        onChange={handleChange}
                        placeholder="University"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="graduationCollege" className="block text-sm font-medium text-gray-700 mb-1">
                        College
                      </label>
                      <input
                        id="graduationCollege"
                        name="graduationCollege"
                        value={formData.graduationCollege}
                        onChange={handleChange}
                        placeholder="College"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="graduationYear"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        placeholder="Year"
                        className={`border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                          formErrors.graduationYear ? "border-red-500" : "border-gray-300"
                        }`}
                        aria-required="true"
                      />
                      {formErrors.graduationYear && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.graduationYear}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Intermediate */}
                <div className="p-4 border border-gray-100 rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Intermediate</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="interBoard" className="block text-sm font-medium text-gray-700 mb-1">
                        Board
                      </label>
                      <input
                        id="interBoard"
                        name="interBoard"
                        value={formData.interBoard}
                        onChange={handleChange}
                        placeholder="Board"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="interState" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <select
                        id="interState"
                        name="interState"
                        value={formData.interState}
                        onChange={handleChange}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      >
                        <option value="">Select State</option>
                        {Object.keys(statesWithCities).map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="interStateBoard" className="block text-sm font-medium text-gray-700 mb-1">
                        State Board
                      </label>
                      <input
                        id="interStateBoard"
                        name="interStateBoard"
                        value={formData.interStateBoard}
                        onChange={handleChange}
                        placeholder="State Board"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="interCity" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <select
                        id="interCity"
                        name="interCity"
                        value={formData.interCity}
                        onChange={handleChange}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      >
                        <option value="">Select City</option>
                        {statesWithCities[formData.interState]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="interCollege" className="block text-sm font-medium text-gray-700 mb-1">
                        College
                      </label>
                      <input
                        id="interCollege"
                        name="interCollege"
                        value={formData.interCollege}
                        onChange={handleChange}
                        placeholder="College"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="interStream" className="block text-sm font-medium text-gray-700 mb-1">
                        Stream
                      </label>
                      <input
                        id="interStream"
                        name="interStream"
                        value={formData.interStream}
                        onChange={handleChange}
                        placeholder="Stream"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="interYear" className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        id="interYear"
                        name="interYear"
                        value={formData.interYear}
                        onChange={handleChange}
                        placeholder="Year"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* 10th */}
                <div className="p-4 border border-gray-100 rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">10th</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="tenthBoard" className="block text-sm font-medium text-gray-700 mb-1">
                        Board
                      </label>
                      <input
                        id="tenthBoard"
                        name="tenthBoard"
                        value={formData.tenthBoard}
                        onChange={handleChange}
                        placeholder="Board"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="tenthState" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <select
                        id="tenthState"
                        name="tenthState"
                        value={formData.tenthState}
                        onChange={handleChange}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      >
                        <option value="">Select State</option>
                        {Object.keys(statesWithCities).map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="tenthCity" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <select
                        id="tenthCity"
                        name="tenthCity"
                        value={formData.tenthCity}
                        onChange={handleChange}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      >
                        <option value="">Select City</option>
                        {statesWithCities[formData.tenthState]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="tenthSchool" className="block text-sm font-medium text-gray-700 mb-1">
                        School
                      </label>
                      <input
                        id="tenthSchool"
                        name="tenthSchool"
                        value={formData.tenthSchool}
                        onChange={handleChange}
                        placeholder="School"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="tenthYear" className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        id="tenthYear"
                        name="tenthYear"
                        value={formData.tenthYear}
                        onChange={handleChange}
                        placeholder="Year"
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Experience */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Years of Experience"
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company Name"
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="Job Title"
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Duration (e.g., 2020-2022)"
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                    Responsibilities
                  </label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    placeholder="Describe your responsibilities"
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                    rows={4}
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Location
                  </label>
                  <input
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    placeholder="Current Location"
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="preferredLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Location
                  </label>
                  <input
                    id="preferredLocation"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    placeholder="Preferred Location"
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Resume */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Resume <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="resume"
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    className={`border p-2 rounded w-full ${
                      formErrors.resume ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-required="true"
                  />
                  {formErrors.resume && <p className="text-red-500 text-xs mt-1">{formErrors.resume}</p>}
                  {formData.resume && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {formData.resume.name}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-2" />
                  Previous
                </button>
              )}
              {step < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Next
                  <ChevronRight className="w-4 h-4 inline ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CandidateDetails;