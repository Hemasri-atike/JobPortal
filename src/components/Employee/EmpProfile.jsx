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
  Bars3Icon,
} from "@heroicons/react/24/outline";

const EmpProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employee, loading, error } = useSelector((state) => state.employee);
  const { userInfo } = useSelector((state) => state.user);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const steps = [
    { name: "Personal Info", key: "personal" },
    { name: "Skills", key: "skills" },
    { name: "Education", key: "education" },
    { name: "Experience", key: "experience" },
    { name: "Certifications", key: "certifications" },
    { name: "Resume & Review", key: "resume" },
  ];

  const states = Object.keys(statesWithCities);

  useEffect(() => {
    if (!userInfo || !localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const storedEmployeeId = localStorage.getItem("employeeId");
    setEmployeeId(storedEmployeeId);
  }, [navigate, userInfo]);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployee(employeeId)).catch((err) => console.error("Failed to fetch employee:", err));
    }
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (userInfo) {
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
    }
  }, [dispatch, userInfo]);

  const handleStateChange = useCallback((e) => {
    const selectedState = e.target.value;
    setEduInput((prev) => ({ ...prev, state: selectedState, city: "" }));
    setFilteredCities(statesWithCities[selectedState] || []);
  }, []);

  const handleChange = useCallback(
    (e) => dispatch(updateField({ field: e.target.name, value: e.target.value })),
    [dispatch]
  );

  const handleEduChange = useCallback(
    (e) => {
      if (e.target.name === "state") handleStateChange(e);
      else setEduInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [handleStateChange]
  );

  const handleExpChange = useCallback(
    (e) => setExpForm((prev) => ({ ...prev, [e.target.name]: e.target.value })),
    []
  );

  const handleAddSkill = async () => {
    if (!skillInput.trim()) {
      console.log("Please enter a skill");
      return;
    }
    try {
      if (employeeId) await dispatch(addEmployeeSkill({ employeeId, skill: skillInput })).unwrap();
      else dispatch(updateField({ field: "skills", value: [...employee.skills, skillInput] }));
      setSkillInput("");
    } catch (error) {
      console.log(error.message || "Failed to add skill");
    }
  };

  const handleAddEducation = async () => {
    try {
      if (employeeId) await dispatch(addEmployeeEducation({ employeeId, education: eduInput })).unwrap();
      else dispatch(updateField({ field: "education", value: [...employee.education, eduInput] }));
      setEduInput({ state: "", city: "", university: "", college: "", degree: "", field_of_study: "", duration: "" });
      setFilteredCities([]);
      setShowEduForm(false);
    } catch (error) {
      console.log(error.message || "Failed to add education");
    }
  };

  const handleAddExperience = async () => {
    try {
      if (employeeId) await dispatch(addEmployeeExperience({ employeeId, experience: expForm })).unwrap();
      else dispatch(updateField({ field: "experience", value: [...employee.experience, expForm] }));
      setExpForm({ company_name: "", role: "", duration: "", location: "", description: "" });
      setShowExpForm(false);
    } catch (error) {
      console.log(error.message || "Failed to add experience");
    }
  };

  const handleAddCertification = async () => {
    try {
      const certData = { cert_name: certInput, organization: certOrg, issue_date: certIssueDate || null };
      if (employeeId) await dispatch(addEmployeeCertification({ employeeId, ...certData })).unwrap();
      else
        dispatch(updateField({ field: "certifications", value: [...employee.certifications, certData] }));
      setCertInput("");
      setCertOrg("");
      setCertIssueDate("");
      setShowCertForm(false);
    } catch (error) {
      console.log(error.message || "Failed to add certification");
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
      console.log(error.message || "Failed to remove skill");
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
      console.log(error.message || "Failed to remove education");
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
      console.log(error.message || "Failed to remove experience");
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
      console.log(error.message || "Failed to remove certification");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("Please select a file to upload");
      return;
    }
    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      console.log("Please upload a valid PDF or Word document");
      return;
    }
    try {
      if (employeeId) await dispatch(uploadResume({ employeeId, file })).unwrap();
      else dispatch(setResume({ name: file.name }));
    } catch (error) {
      console.log(error.message || "Failed to upload resume");
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!employee.fullName || !employee.email || !userInfo.id) {
        console.log("Full name, email, and user ID are required.");
        return;
      }
      const genderMap = { Male: "Male", Female: "Female", Other: "Others" };
      const profileData = {
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone || null,
        gender: employee.gender ? genderMap[employee.gender] : null,
        dob: employee.dob || null,
        location: employee.location || null,
        resume: employee.resume ? employee.resume.name : null,
        skills: employee.skills || [],
        education: employee.education || [],
        experience: employee.experience || [],
        certifications: employee.certifications || [],
        userId: userInfo.id,
      };
      const result = await dispatch(saveEmployee(profileData)).unwrap();
      setEmployeeId(result.employeeId);
      localStorage.setItem("employeeId", result.employeeId);
      localStorage.setItem("employeeProfile", JSON.stringify({ employeeId: result.employeeId, ...profileData }));
      await dispatch(fetchEmployee(result.employeeId)).unwrap();
      console.log("Profile saved successfully!");
    } catch (error) {
      console.log(error.message || "Failed to save profile. Please check your inputs and try again.");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const goToStep = (index) => setCurrentStep(index);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <Header />
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-full shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>
      <div className="flex">
        <aside
          className={`w-full md:w-64 bg-white shadow-lg fixed md:sticky top-0 h-screen z-20 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } md:shadow-2xl`}
        >
          <Sidebar role="employer" />
          <button
            className="md:hidden absolute top-4 right-4 text-gray-500"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full md:ml-64">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3 animate-pulse" role="alert">
              <XMarkIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="mt-1 text-sm text-gray-600">Build a strong profile to attract employers.</p>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between space-x-4">
              {steps.map((step, index) => (
                <button
                  key={step.key}
                  onClick={() => goToStep(index)}
                  className={`flex-1 py-3 px-4 rounded-md text-center transition-all duration-200 ${
                    currentStep === index
                      ? "bg-indigo-600 text-white"
                      : currentStep > index
                      ? "bg-green-100 text-green-800 cursor-default"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                  disabled={currentStep < index && currentStep !== index}
                  aria-label={`Go to ${step.name} step ${index + 1}`}
                >
                  <span className="font-medium">{step.name}</span>
                  <span className="block text-xs mt-1">
                    {currentStep > index ? "Completed" : `Step ${index + 1}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-8">
            {currentStep === 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
                    { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
                    { label: "Phone", name: "phone", type: "tel", placeholder: "Enter your phone number" },
                    { label: "Date of Birth", name: "dob", type: "date" },
                    { label: "Location", name: "location", type: "text", placeholder: "Enter your city or region" },
                  ].map((field) => (
                    <div key={field.name} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={field.name}>
                        {field.label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        value={employee[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                        disabled={loading}
                        required={field.name === "fullName" || field.name === "email"}
                      />
                    </div>
                  ))}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gender">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={employee.gender || ""}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200 text-sm disabled:bg-gray-100 disabled:text-gray-400"
                      disabled={loading}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {currentStep === 1 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200 text-sm"
                    placeholder="Add a skill (e.g., JavaScript)"
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    disabled={loading}
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    <PlusIcon className="w-5 h-5 inline-block" /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {employee.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {currentStep === 2 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>
                <button
                  onClick={() => setShowEduForm(!showEduForm)}
                  className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                  disabled={loading}
                >
                  {showEduForm ? <XMarkIcon className="w-5 h-5 inline-block" /> : <PlusIcon className="w-5 h-5 inline-block" />}
                  {showEduForm ? "Cancel" : "Add Education"}
                </button>
                {showEduForm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    {[
                      { name: "college", placeholder: "College Name" },
                      { name: "university", placeholder: "University" },
                      { name: "degree", placeholder: "Degree (e.g., B.Sc.)" },
                      { name: "field_of_study", placeholder: "Field of Study" },
                      { name: "duration", placeholder: "Duration (e.g., 2018-2022)" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={field.name}>
                          {field.placeholder}
                        </label>
                        <input
                          id={field.name}
                          type="text"
                          name={field.name}
                          value={eduInput[field.name]}
                          onChange={handleEduChange}
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200"
                          placeholder={field.placeholder}
                          disabled={loading}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="state">
                        State
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={eduInput.state}
                        onChange={handleEduChange}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200"
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
                        City
                      </label>
                      <select
                        id="city"
                        name="city"
                        value={eduInput.city}
                        onChange={handleEduChange}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200"
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
                    <div className="md:col-span-2">
                      <button
                        onClick={handleAddEducation}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        <PlusIcon className="w-5 h-5 inline-block" /> Save Education
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {employee.education?.map((edu, index) => (
                    <div
                      key={edu.id || index}
                      className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-all"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{edu.college}, {edu.university}</p>
                        <p className="text-sm text-gray-600">{edu.degree} in {edu.field_of_study} ({edu.duration})</p>
                        <p className="text-sm text-gray-600">{edu.city}, {edu.state}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveEducation(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentStep === 3 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Experience</h2>
                <button
                  onClick={() => setShowExpForm(!showExpForm)}
                  className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                  disabled={loading}
                >
                  {showExpForm ? <XMarkIcon className="w-5 h-5 inline-block" /> : <PlusIcon className="w-5 h-5 inline-block" />}
                  {showExpForm ? "Cancel" : "Add Experience"}
                </button>
                {showExpForm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    {[
                      { name: "company_name", placeholder: "Company Name" },
                      { name: "role", placeholder: "Job Title" },
                      { name: "duration", placeholder: "Duration (e.g., Jan 2020 - Dec 2022)" },
                      { name: "location", placeholder: "Location" },
                      { name: "description", placeholder: "Describe your role" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={field.name}>
                          {field.placeholder}
                        </label>
                        <input
                          id={field.name}
                          type="text"
                          name={field.name}
                          value={expForm[field.name]}
                          onChange={handleExpChange}
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200"
                          placeholder={field.placeholder}
                          disabled={loading}
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <button
                        onClick={handleAddExperience}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        <PlusIcon className="w-5 h-5 inline-block" /> Save Experience
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {employee.experience?.map((exp, index) => (
                    <div
                      key={exp.id || index}
                      className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-all"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{exp.role} at {exp.company_name}</p>
                        <p className="text-sm text-gray-600">{exp.duration} | {exp.location}</p>
                        <p className="text-sm text-gray-600">{exp.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveExperience(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentStep === 4 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Certifications</h2>
                <button
                  onClick={() => setShowCertForm(!showCertForm)}
                  className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                  disabled={loading}
                >
                  {showCertForm ? <XMarkIcon className="w-5 h-5 inline-block" /> : <PlusIcon className="w-5 h-5 inline-block" />}
                  {showCertForm ? "Cancel" : "Add Certification"}
                </button>
                {showCertForm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="certInput">
                        Certification Name
                      </label>
                      <input
                        id="certInput"
                        type="text"
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200"
                        placeholder="e.g., AWS Certified Developer"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="certOrg">
                        Organization
                      </label>
                      <input
                        id="certOrg"
                        type="text"
                        value={certOrg}
                        onChange={(e) => setCertOrg(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200"
                        placeholder="e.g., AWS"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="certIssueDate">
                        Issue Date
                      </label>
                      <input
                        id="certIssueDate"
                        type="date"
                        value={certIssueDate}
                        onChange={(e) => setCertIssueDate(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all duration-200"
                        disabled={loading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        onClick={handleAddCertification}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        <PlusIcon className="w-5 h-5 inline-block" /> Save Certification
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {employee.certifications?.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                    >
                      {cert.cert_name || cert} {cert.organization && `(${cert.organization})`}
                      <button
                        onClick={() => handleRemoveCertification(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {currentStep === 5 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Resume & Review</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="resumeUpload">
                    Upload Resume
                  </label>
                  <input
                    id="resumeUpload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="w-full p-3 rounded-lg border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-800 file:hover:bg-indigo-200 file:transition-all file:duration-200"
                    disabled={loading}
                  />
                  {employee.resume && (
                    <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                      <CheckIcon className="w-5 h-5" /> Uploaded: {employee.resume.name}
                    </p>
                  )}
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p><strong>Name:</strong> {employee.fullName || "Not provided"}</p>
                      <p><strong>Email:</strong> {employee.email || "Not provided"}</p>
                      <p><strong>Phone:</strong> {employee.phone || "Not provided"}</p>
                      <p><strong>Location:</strong> {employee.location || "Not provided"}</p>
                      <p><strong>Gender:</strong> {employee.gender || "Not provided"}</p>
                    </div>
                    <div>
                      <p><strong>Skills:</strong> {employee.skills?.join(", ") || "None"}</p>
                      <p><strong>Education:</strong> {employee.education?.length > 0 ? employee.education.map((e) => `${e.degree} from ${e.college}`).join(", ") : "None"}</p>
                      <p><strong>Experience:</strong> {employee.experience?.length > 0 ? employee.experience.map((e) => `${e.role} at ${e.company_name}`).join(", ") : "None"}</p>
                      <p><strong>Certifications:</strong> {employee.certifications?.map((c) => c.cert_name).join(", ") || "None"}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                disabled={currentStep === 0 || loading}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="w-5 h-5 inline-block -ml-2" /> Back
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next <ArrowRightIcon className="w-5 h-5 inline-block -mr-2" />
                </button>
              ) : (
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 inline-block" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <span>Save Profile</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpProfile;