import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../pages/cvdetails/layout/Sidebar.jsx";
import Header from "../../pages/navbar/Header.jsx";
import {
  updateField,
  setResume,
  setAllFields,
  fetchEmployee,
  saveEmployee,
  uploadResume,
  addEmployeeSkill,
  removeEmployeeSkill,
  addEmployeeEducation,
  removeEmployeeEducation,
  addEmployeeExperience,
  removeEmployeeExperience,
  addEmployeeCertification,
  removeEmployeeCertification,
} from "../../store/empprofileSlice.js";
import statesWithCities from "../../components/common/Statesncities.jsx";
import {
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const EmpProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employee, loading, error } = useSelector((state) => state.employee);
  const { userInfo, userType } = useSelector((state) => state.user);
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [certOrg, setCertOrg] = useState("");
  const [certIssueDate, setCertIssueDate] = useState("");
  const [eduInput, setEduInput] = useState({
    state: "",
    city: "",
    university: "",
    college: "",
    degree: "",
    field_of_study: "",
    duration: "",
  });
  const [expForm, setExpForm] = useState({
    company_name: "",
    role: "",
    duration: "",
    location: "",
    description: "",
  });
  const [showEduForm, setShowEduForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [filteredCities, setFilteredCities] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: "Personal Details", key: "personal" },
    { name: "Skills", key: "skills" },
    { name: "Education", key: "education" },
    { name: "Experience", key: "experience" },
    { name: "Certifications", key: "certifications" },
    { name: "Resume", key: "resume" },
  ];

  const states = Object.keys(statesWithCities);

  useEffect(() => {
    console.log("useEffect: userInfo:", userInfo, "token:", localStorage.getItem("token"), "loading:", loading);
    if (!userInfo || !localStorage.getItem("token")) {
      console.error("No user info or token found, redirecting to login");
      navigate("/login");
      return;
    }

    const storedEmployeeId = localStorage.getItem("employeeId");
    setEmployeeId(storedEmployeeId);

    dispatch(
      setAllFields({
        fullName: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.mobile || "",
        gender: employee.gender || "",
        dob: employee.dob || "",
        location: employee.location || userInfo.location || "",
        skills: employee.skills || [],
        education: employee.education || [],
        experience: employee.experience || [],
        certifications: employee.certifications || [],
        resume: employee.resume || null,
      })
    );

    if (storedEmployeeId) {
      dispatch(fetchEmployee(storedEmployeeId)).catch((err) => {
        console.error("Failed to fetch employee:", err);
      });
    }

    if (error) {
      console.error("Redux state error:", { error, employee, userInfo });
    }
  }, [dispatch, navigate, userInfo, userType, error]);

  const handleStateChange = useCallback((e) => {
    const selectedState = e.target.value;
    setEduInput((prev) => ({ ...prev, state: selectedState, city: "" }));
    setFilteredCities(statesWithCities[selectedState] || []);
  }, []);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleChange = useCallback(
    (e) => {
      console.log("handleChange:", e.target.name, e.target.value);
      dispatch(updateField({ field: e.target.name, value: e.target.value }));
    },
    [dispatch]
  );

  const handleEduChange = useCallback(
    (e) => {
      console.log("handleEduChange:", e.target.name, e.target.value);
      if (e.target.name === "state") {
        handleStateChange(e);
      } else {
        setEduInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      }
    },
    [handleStateChange]
  );

  const handleExpChange = useCallback(
    (e) => {
      console.log("handleExpChange:", e.target.name, e.target.value);
      setExpForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleAddSkill = async () => {
    if (!skillInput.trim()) {
      console.error("Skill input is empty");
      alert("Please enter a skill");
      return;
    }
    try {
      if (employeeId) {
        await dispatch(addEmployeeSkill({ employeeId, skill: skillInput })).unwrap();
      } else {
        dispatch(updateField({ field: "skills", value: [...employee.skills, skillInput] }));
      }
      setSkillInput("");
    } catch (error) {
      console.error("Error adding skill:", error);
      alert(error.message || "Failed to add skill");
    }
  };

  const handleAddEducation = async () => {
    try {
      if (employeeId) {
        await dispatch(addEmployeeEducation({ employeeId, education: eduInput })).unwrap();
      } else {
        dispatch(updateField({ field: "education", value: [...employee.education, eduInput] }));
      }
      setEduInput({
        state: "",
        city: "",
        university: "",
        college: "",
        degree: "",
        field_of_study: "",
        duration: "",
      });
      setFilteredCities([]);
      setShowEduForm(false);
    } catch (error) {
      console.error("Error adding education:", error);
      alert(error.message || "Failed to add education");
    }
  };

  const handleAddExperience = async () => {
    try {
      if (employeeId) {
        await dispatch(addEmployeeExperience({ employeeId, experience: expForm })).unwrap();
      } else {
        dispatch(updateField({ field: "experience", value: [...employee.experience, expForm] }));
      }
      setExpForm({
        company_name: "",
        role: "",
        duration: "",
        location: "",
        description: "",
      });
      setShowExpForm(false);
    } catch (error) {
      console.error("Error adding experience:", error);
      alert(error.message || "Failed to add experience");
    }
  };

  const handleAddCertification = async () => {
    try {
      const certData = {
        cert_name: certInput,
        organization: certOrg,
        issue_date: certIssueDate || null,
      };
      if (employeeId) {
        await dispatch(addEmployeeCertification({ employeeId, ...certData })).unwrap();
      } else {
        dispatch(
          updateField({ field: "certifications", value: [...employee.certifications, certData] })
        );
      }
      setCertInput("");
      setCertOrg("");
      setCertIssueDate("");
      setShowCertForm(false);
    } catch (error) {
      console.error("Error adding certification:", error);
      alert(error.message || "Failed to add certification");
    }
  };

  const handleRemoveSkill = async (index) => {
    try {
      if (employeeId) {
        const skill = employee.skills[index];
        await dispatch(removeEmployeeSkill({ employeeId, skill })).unwrap();
      } else {
        const newSkills = employee.skills.filter((_, i) => i !== index);
        dispatch(updateField({ field: "skills", value: newSkills }));
      }
    } catch (error) {
      console.error("Error removing skill:", error);
      alert(error.message || "Failed to remove skill");
    }
  };

  const handleRemoveEducation = async (index) => {
    try {
      if (employeeId) {
        const educationId = employee.education[index].id;
        await dispatch(removeEmployeeEducation({ employeeId, educationId })).unwrap();
      } else {
        const newEducation = employee.education.filter((_, i) => i !== index);
        dispatch(updateField({ field: "education", value: newEducation }));
      }
    } catch (error) {
      console.error("Error removing education:", error);
      alert(error.message || "Failed to remove education");
    }
  };

  const handleRemoveExperience = async (index) => {
    try {
      if (employeeId) {
        const experienceId = employee.experience[index].id;
        await dispatch(removeEmployeeExperience({ employeeId, experienceId })).unwrap();
      } else {
        const newExperience = employee.experience.filter((_, i) => i !== index);
        dispatch(updateField({ field: "experience", value: newExperience }));
      }
    } catch (error) {
      console.error("Error removing experience:", error);
      alert(error.message || "Failed to remove experience");
    }
  };

  const handleRemoveCertification = async (index) => {
    try {
      if (employeeId) {
        const cert = employee.certifications[index];
        await dispatch(removeEmployeeCertification({ employeeId, cert_name: cert.cert_name || cert })).unwrap();
      } else {
        const newCertifications = employee.certifications.filter((_, i) => i !== index);
        dispatch(updateField({ field: "certifications", value: newCertifications }));
      }
    } catch (error) {
      console.error("Error removing certification:", error);
      alert(error.message || "Failed to remove certification");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn("No file selected for resume upload");
      alert("Please select a file to upload");
      return;
    }
    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      console.error("Invalid file type for resume upload:", file.type);
      alert("Please upload a valid PDF or Word document");
      return;
    }
    try {
      if (employeeId) {
        await dispatch(uploadResume({ employeeId, file })).unwrap();
      } else {
        dispatch(setResume({ name: file.name }));
      }
      console.log("Resume uploaded successfully:", file.name);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert(error.message || "Failed to upload resume");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const genderMap = {
        Male: "Male",
        Female: "Female",
        Other: "Others",
      };
      const profileData = {
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        gender: employee.gender ? genderMap[employee.gender] : null,
        dob: employee.dob || null,
        location: employee.location,
        resume: employee.resume ? employee.resume.name : null,
        skills: employee.skills || [],
        education: employee.education || [],
        experience: employee.experience || [],
        certifications: employee.certifications || [],
        userId: userInfo.id,
      };
      console.log("Saving profile with data:", profileData);
      const result = await dispatch(saveEmployee(profileData)).unwrap();
      setEmployeeId(result.employeeId);
      localStorage.setItem("employeeId", result.employeeId);
      localStorage.setItem("employeeProfile", JSON.stringify({ employeeId: result.employeeId, ...profileData }));
      await dispatch(fetchEmployee(result.employeeId)).unwrap();
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(error.message || "Failed to save profile. Please check your inputs and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-2xl hidden md:block fixed h-full z-10">
          <Sidebar role="employer" />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto md:ml-64">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-xl flex items-center gap-3 animate-slide-in">
              <XMarkIcon className="w-6 h-6" />
              <span>
                {error === "Employee not found or unauthorized"
                  ? "No employee profile found. Please save your profile to create one."
                  : error === "Authorization token required" || error === "Token expired, please log in again"
                  ? "Your session has expired. Please log in again."
                  : `Error: ${error}`}
              </span>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Your Profile</h2>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.key} className="flex-1 flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      index <= currentStep
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                        : "bg-gray-300"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckIcon className="w-6 h-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="ml-2 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        index <= currentStep ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </p>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 mt-2 ${
                          index < currentStep ? "bg-indigo-500" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Form Card */}
          <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 mb-8 transition-all duration-300">
            {/* Personal Details */}
            {currentStep === 0 && (
              <section>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    {
                      label: "Full Name",
                      name: "fullName",
                      type: "text",
                      placeholder: "Enter your full name",
                    },
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      placeholder: "Enter your email",
                    },
                    {
                      label: "Phone",
                      name: "phone",
                      type: "tel",
                      placeholder: "Enter your phone number",
                    },
                    {
                      label: "Date of Birth",
                      name: "dob",
                      type: "date",
                    },
                    {
                      label: "Location",
                      name: "location",
                      type: "text",
                      placeholder: "Enter your city or region",
                    },
                  ].map((field) => (
                    <div key={field.name} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={employee[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 focus:border-indigo-500 bg-white transition-all duration-200"
                        disabled={loading}
                      />
                    </div>
                  ))}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={employee.gender || ""}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300 bg-white transition-all duration-200"
                      disabled={loading}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {userInfo.company_name && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={userInfo.company_name || "No company info"}
                        className="w-full p-3 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500 border border-gray-200"
                        disabled
                      />
                    </div>
                  )}
                  {userInfo.position && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        value={userInfo.position || ""}
                        className="w-full p-3 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500 border border-gray-200"
                        disabled
                      />
                    </div>
                  )}
                  {userInfo.about && (
                    <div className="col-span-1 sm:col-span-2 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                      <textarea
                        value={userInfo.about || ""}
                        className="w-full p-3 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500 border border-gray-200"
                        disabled
                      />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Skills */}
            {currentStep === 1 && (
              <section>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 bg-white transition-all duration-200"
                    placeholder="Enter a skill (e.g., JavaScript, Python)"
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 flex items-center gap-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    <PlusIcon className="w-5 h-5" /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {employee.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-indigo-200 transition-all duration-200"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${skill}`}
                        disabled={loading}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {currentStep === 2 && (
              <section>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Education</h3>
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={() => setShowEduForm(!showEduForm)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-2 transition-colors duration-200"
                    disabled={loading}
                  >
                    {showEduForm ? (
                      <>
                        <XMarkIcon className="w-5 h-5" /> Cancel
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5" /> Add Education
                      </>
                    )}
                  </button>
                </div>
                {showEduForm && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 p-4 bg-gray-50 rounded-xl">
                    {[
                      { name: "college", placeholder: "College Name" },
                      { name: "university", placeholder: "University" },
                      { name: "duration", placeholder: "Duration (e.g., 2018-2022)" },
                      { name: "degree", placeholder: "Degree (e.g., B.Sc.)" },
                      { name: "field_of_study", placeholder: "Field of Study" },
                    ].map((field) => (
                      <div key={field.name} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.placeholder}</label>
                        <input
                          type="text"
                          name={field.name}
                          value={eduInput[field.name]}
                          onChange={handleEduChange}
                          className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 bg-white transition-all duration-200"
                          placeholder={field.placeholder}
                          disabled={loading}
                        />
                      </div>
                    ))}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <select
                        name="state"
                        value={eduInput.state}
                        onChange={handleEduChange}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 bg-white transition-all duration-200"
                        disabled={loading}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <select
                        name="city"
                        value={eduInput.city}
                        onChange={handleEduChange}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 bg-white transition-all duration-200"
                        disabled={loading || !eduInput.state}
                      >
                        <option value="">Select City</option>
                        {filteredCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddEducation}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        <PlusIcon className="w-5 h-5" /> Save Education
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {employee.education?.map((edu, index) => (
                    <div
                      key={edu.id || index}
                      className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{edu.college}, {edu.university}</p>
                        <p className="text-sm text-gray-600">{edu.city}, {edu.state} • {edu.duration}</p>
                        {edu.degree && (
                          <p className="text-sm text-gray-600">{edu.degree} in {edu.field_of_study}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveEducation(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        aria-label={`Remove ${edu.college}`}
                        disabled={loading}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {currentStep === 3 && (
              <section>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Experience</h3>
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={() => setShowExpForm(!showExpForm)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-2 transition-colors duration-200"
                    disabled={loading}
                  >
                    {showExpForm ? (
                      <>
                        <XMarkIcon className="w-5 h-5" /> Cancel
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5" /> Add Experience
                      </>
                    )}
                  </button>
                </div>
                {showExpForm && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 p-4 bg-gray-50 rounded-xl">
                    {[
                      { name: "company_name", placeholder: "Company Name" },
                      { name: "role", placeholder: "Role" },
                      { name: "duration", placeholder: "Duration (e.g., Jan 2020 - Dec 2022)" },
                      { name: "location", placeholder: "Location" },
                      { name: "description", placeholder: "Description" },
                    ].map((field) => (
                      <div key={field.name} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.placeholder}</label>
                        <input
                          type="text"
                          name={field.name}
                          value={expForm[field.name]}
                          onChange={handleExpChange}
                          className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 bg-white transition-all duration-200"
                          placeholder={field.placeholder}
                          disabled={loading}
                        />
                      </div>
                    ))}
                    <div className="col-span-1 sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        <PlusIcon className="w-5 h-5" /> Save Experience
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {employee.experience?.map((exp, index) => (
                    <div
                      key={exp.id || index}
                      className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{exp.role} at {exp.company_name}</p>
                        <p className="text-sm text-gray-600">{exp.duration}</p>
                        {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                        {exp.description && <p className="text-sm text-gray-600">{exp.description}</p>}
                      </div>
                      <button
                        onClick={() => handleRemoveExperience(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        aria-label={`Remove ${exp.role} at ${exp.company_name}`}
                        disabled={loading}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {currentStep === 4 && (
              <section>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Certifications</h3>
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={() => setShowCertForm(!showCertForm)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-2 transition-colors duration-200"
                    disabled={loading}
                  >
                    {showCertForm ? (
                      <>
                        <XMarkIcon className="w-5 h-5" /> Cancel
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5" /> Add Certification
                      </>
                    )}
                  </button>
                </div>
                {showCertForm && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 p-4 bg-gray-50 rounded-xl">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
                      <input
                        type="text"
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 bg-white transition-all duration-200"
                        placeholder="Certification Name (e.g., AWS Certified Developer)"
                        disabled={loading}
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                      <input
                        type="text"
                        value={certOrg}
                        onChange={(e) => setCertOrg(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 bg-white transition-all duration-200"
                        placeholder="Issuing Organization (e.g., AWS)"
                        disabled={loading}
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                      <input
                        type="date"
                        value={certIssueDate}
                        onChange={(e) => setCertIssueDate(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 bg-white transition-all duration-200"
                        placeholder="Issue Date"
                        disabled={loading}
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddCertification}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        <PlusIcon className="w-5 h-5" /> Save Certification
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {employee.certifications?.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-indigo-200 transition-all duration-200"
                    >
                      {cert.cert_name || cert} {cert.organization && `(${cert.organization})`}
                      <button
                        onClick={() => handleRemoveCertification(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${cert.cert_name || cert}`}
                        disabled={loading}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Resume */}
            {currentStep === 5 && (
              <section>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Resume</h3>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="w-full p-3 rounded-lg border border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-800 file:hover:bg-indigo-200 file:transition-all file:duration-200"
                  disabled={loading}
                />
                {employee.resume && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                    <CheckIcon className="w-5 h-5" /> Uploaded: {employee.resume.name}
                  </p>
                )}
              </section>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0 || loading}
                className={`px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 ${
                  currentStep === 0 || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                <ArrowLeftIcon className="w-5 h-5" /> Back
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  }`}
                >
                  Next <ArrowRightIcon className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  }`}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" /> Save Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Profile Preview Card */}
          {employeeId && (
            <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Profile Preview</h3>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="w-24 h-24 sm:w-32 sm:h-32 text-gray-400" />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-4">
                    <p>
                      <strong className="text-gray-800 font-semibold">Name:</strong>{" "}
                      <span className="text-gray-600">{employee.fullName || "Not provided"}</span>
                    </p>
                    <p>
                      <strong className="text-gray-800 font-semibold">Email:</strong>{" "}
                      <span className="text-gray-600">{employee.email || "Not provided"}</span>
                    </p>
                    <p>
                      <strong className="text-gray-800 font-semibold">Phone:</strong>{" "}
                      <span className="text-gray-600">{employee.phone || "Not provided"}</span>
                    </p>
                    <p>
                      <strong className="text-gray-800 font-semibold">Location:</strong>{" "}
                      <span className="text-gray-600">{employee.location || userInfo.location || "Not provided"}</span>
                    </p>
                    <p>
                      <strong className="text-gray-800 font-semibold">Gender:</strong>{" "}
                      <span className="text-gray-600">{employee.gender || "Not provided"}</span>
                    </p>
                    {userInfo.company_name && (
                      <p>
                        <strong className="text-gray-800 font-semibold">Company:</strong>{" "}
                        <span className="text-gray-600">{userInfo.company_name || "Not provided"}</span>
                      </p>
                    )}
                    {userInfo.position && (
                      <p>
                        <strong className="text-gray-800 font-semibold">Position:</strong>{" "}
                        <span className="text-gray-600">{userInfo.position || "Not provided"}</span>
                      </p>
                    )}
                    {userInfo.about && (
                      <p>
                        <strong className="text-gray-800 font-semibold">About:</strong>{" "}
                        <span className="text-gray-600">{userInfo.about || "Not provided"}</span>
                      </p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <p>
                      <strong className="text-gray-800 font-semibold">Skills:</strong>{" "}
                      <span className="text-gray-600">
                        {employee.skills?.length > 0 ? employee.skills.join(", ") : "None added"}
                      </span>
                    </p>
                    <div>
                      <strong className="text-gray-800 font-semibold">Education:</strong>
                      {employee.education?.length > 0 ? (
                        employee.education.map((edu, i) => (
                          <p key={edu.id || i} className="text-gray-600 mt-1">
                            {edu.college}, {edu.university} ({edu.city}, {edu.state}) - {edu.duration}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-600 mt-1">None added</p>
                      )}
                    </div>
                    <div>
                      <strong className="text-gray-800 font-semibold">Experience:</strong>
                      {employee.experience?.length > 0 ? (
                        employee.experience.map((exp, i) => (
                          <p key={exp.id || i} className="text-gray-600 mt-1">
                            {exp.role} at {exp.company_name} ({exp.duration})
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-600 mt-1">None added</p>
                      )}
                    </div>
                    <div>
                      <strong className="text-gray-800 font-semibold">Certifications:</strong>{" "}
                      <span className="text-gray-600">
                        {employee.certifications?.length > 0
                          ? employee.certifications
                              .map((cert) => cert.cert_name || cert)
                              .join(", ")
                          : "None added"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmpProfile;