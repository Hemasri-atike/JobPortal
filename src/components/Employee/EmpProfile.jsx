import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../pages/cvdetails/layout/Sidebar.jsx";
import Header from "../../pages/navbar/Header.jsx";
import {
  updateField,
  setResume,
  resetProfile,
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
import { logoutUser } from "../../store/userSlice.js";

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
  const [formErrors, setFormErrors] = useState({});
  const [showEduForm, setShowEduForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  // Initialize form with userInfo and fetch employee data
  useEffect(() => {
    if (!userInfo || !localStorage.getItem("token")) {
      console.warn("No userInfo or token found, redirecting to login");
      navigate("/login");
      return;
    }

    console.log("UserInfo:", userInfo);
    console.log("UserType:", userType);
    console.log("Token:", localStorage.getItem("token"));

    const storedEmployeeId = localStorage.getItem("employeeId");
    setEmployeeId(storedEmployeeId);

    // Pre-fill with userInfo
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

    // Fetch employee data if employeeId exists
    if (storedEmployeeId) {
      dispatch(fetchEmployee(storedEmployeeId));
    }
  }, [dispatch, navigate, userInfo, userType]);

  // Profile Completion Score
  const calculateCompletionScore = () => {
    let score = 0;
    if (employee.fullName) score += 20;
    if (employee.email) score += 20;
    if (employee.phone) score += 20;
    if (employee.skills?.length > 0) score += 20;
    if (employee.education?.length > 0 || employee.experience?.length > 0) score += 20;
    return score;
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!employee.fullName) newErrors.fullName = "Full name is required";
    if (!employee.email || !/\S+@\S+\.\S+/.test(employee.email))
      newErrors.email = "Valid email is required";
    if (!employee.phone || !/^\+?\d{10,15}$/.test(employee.phone))
      newErrors.phone = "Valid phone number is required";
    if (!employee.location) newErrors.location = "Location is required";
    return newErrors;
  };

  const validateEducation = () => {
    const { state, city, university, college, duration } = eduInput;
    return state && city && university && college && duration;
  };

  const validateExperience = () => {
    const { company_name, role, duration } = expForm;
    return company_name && role && duration;
  };

  const validateCertification = () => {
    return certInput.trim().length > 0;
  };

  // Handlers
  const handleChange = (e) => {
    dispatch(updateField({ field: e.target.name, value: e.target.value }));
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleEduChange = (e) =>
    setEduInput({ ...eduInput, [e.target.name]: e.target.value });

  const handleExpChange = (e) =>
    setExpForm({ ...expForm, [e.target.name]: e.target.value });

  const handleAddSkill = async () => {
    if (!skillInput.trim()) {
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
      alert(error || "Failed to add skill");
    }
  };

  const handleAddEducation = async () => {
    if (!validateEducation()) {
      alert("Please fill all required education fields");
      return;
    }
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
      setShowEduForm(false);
    } catch (error) {
      alert(error || "Failed to add education");
    }
  };

  const handleAddExperience = async () => {
    if (!validateExperience()) {
      alert("Please fill required experience fields (company, role, duration)");
      return;
    }
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
      alert(error || "Failed to add experience");
    }
  };

  const handleAddCertification = async () => {
    if (!validateCertification()) {
      alert("Please enter a certification");
      return;
    }
    try {
      if (employeeId) {
        await dispatch(
          addEmployeeCertification({
            employeeId,
            cert_name: certInput,
            organization: certOrg,
            issue_date: certIssueDate,
          })
        ).unwrap();
      } else {
        dispatch(
          updateField({ field: "certifications", value: [...employee.certifications, certInput] })
        );
      }
      setCertInput("");
      setCertOrg("");
      setCertIssueDate("");
      setShowCertForm(false);
    } catch (error) {
      alert(error || "Failed to add certification");
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
      alert(error || "Failed to remove skill");
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
      alert(error || "Failed to remove education");
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
      alert(error || "Failed to remove experience");
    }
  };

  const handleRemoveCertification = async (index) => {
    try {
      if (employeeId) {
        const cert_name = employee.certifications[index];
        await dispatch(removeEmployeeCertification({ employeeId, cert_name })).unwrap();
      } else {
        const newCertifications = employee.certifications.filter((_, i) => i !== index);
        dispatch(updateField({ field: "certifications", value: newCertifications }));
      }
    } catch (error) {
      alert(error || "Failed to remove certification");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (
      !file ||
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      alert("Please upload a valid PDF or Word document");
      return;
    }
    try {
      if (employeeId) {
        await dispatch(uploadResume({ employeeId, file })).unwrap();
      } else {
        dispatch(setResume({ name: file.name }));
      }
    } catch (error) {
      alert(error || "Failed to upload resume");
    }
  };

  const handleSaveProfile = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Please fix the errors in the form");
      return;
    }
    try {
      const profileData = {
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        gender: employee.gender,
        dob: employee.dob,
        location: employee.location,
        resume: employee.resume ? employee.resume.name : null,
        skills: employee.skills,
        education: employee.education,
        experience: employee.experience,
        certifications: employee.certifications,
        userId: userInfo.id,
      };
      const result = await dispatch(saveEmployee(profileData)).unwrap();
      setEmployeeId(result.employeeId);
      localStorage.setItem("employeeId", result.employeeId);
      localStorage.setItem("employeeProfile", JSON.stringify({ employeeId: result.employeeId, ...profileData }));
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Save profile error:", error);
      alert(error || "Failed to save profile");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetProfile());
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeProfile");
    navigate("/login");
  };

  // JSX
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg hidden md:block">
          
          <Sidebar role={userType || "employee"} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
              {error === "Employee not found or unauthorized"
                ? "No employee profile found. Please save your profile to create one."
                : error === "Authorization token required" || error === "Token expired, please log in again"
                ? "Your session has expired. Please log in again."
                : error}
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Profile</h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Profile Completion: {calculateCompletionScore()}%</p>
                <div className="w-32 bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${calculateCompletionScore()}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
            {/* Personal Details */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Full Name",
                    name: "fullName",
                    type: "text",
                    placeholder: "Enter your full name",
                    required: true,
                  },
                  {
                    label: "Email",
                    name: "email",
                    type: "email",
                    placeholder: "Enter your email",
                    required: true,
                    // disabled: true,
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    type: "tel",
                    placeholder: "Enter your phone number",
                    required: true,
                  },
                  {
                    label: "Date of Birth",
                    name: "dob",
                    type: "date",
                    required: false,
                  },
                  {
                    label: "Location",
                    name: "location",
                    type: "text",
                    placeholder: "Enter your city or region",
                    required: true,
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={employee[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        formErrors[field.name] ? "border-red-500" : "border-gray-300"
                      } ${field.disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      aria-invalid={formErrors[field.name] ? "true" : "false"}
                      aria-describedby={`${field.name}-error`}
                      required={field.required}
                      disabled={loading || field.disabled}
                    />
                    {formErrors[field.name] && (
                      <p id={`${field.name}-error`} className="text-red-500 text-xs mt-1">
                        {formErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={employee.gender || ""}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all border-gray-300"
                    disabled={loading}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {userInfo.company_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      value={userInfo.company_name || "no company info"}
                      className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                )}
                {userInfo.position && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                      type="text"
                      value={userInfo.position || ""}
                      className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                )}
                {userInfo.about && (
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">About</label>
                    <textarea
                      value={userInfo.about || ""}
                      className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Skills */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                  placeholder="Enter a skill (e.g., JavaScript, Python)"
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {employee.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${skill}`}
                      disabled={loading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Education</h3>
                <button
                  type="button"
                  onClick={() => setShowEduForm(!showEduForm)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  disabled={loading}
                >
                  {showEduForm ? "Cancel" : "Add Education"}
                </button>
              </div>
              {showEduForm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { name: "college", placeholder: "College Name", required: true },
                    { name: "university", placeholder: "University", required: true },
                    { name: "city", placeholder: "City", required: true },
                    { name: "state", placeholder: "State", required: true },
                    { name: "duration", placeholder: "Duration (e.g., 2018-2022)", required: true },
                    { name: "degree", placeholder: "Degree (e.g., B.Sc.)", required: false },
                    { name: "field_of_study", placeholder: "Field of Study", required: false },
                  ].map((field) => (
                    <div key={field.name}>
                      <input
                        type="text"
                        name={field.name}
                        value={eduInput[field.name]}
                        onChange={handleEduChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                        placeholder={field.placeholder}
                        required={field.required}
                        disabled={loading}
                      />
                    </div>
                  ))}
                  <div className="col-span-1 sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Save Education
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {employee.education?.map((edu, index) => (
                  <div
                    key={edu.id || index}
                    className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {edu.college}, {edu.university}
                      </p>
                      <p className="text-sm text-gray-600">
                        {edu.city}, {edu.state} • {edu.duration}
                      </p>
                      {edu.degree && (
                        <p className="text-sm text-gray-600">
                          {edu.degree} in {edu.field_of_study}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${edu.college}`}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Experience</h3>
                <button
                  type="button"
                  onClick={() => setShowExpForm(!showExpForm)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  disabled={loading}
                >
                  {showExpForm ? "Cancel" : "Add Experience"}
                </button>
              </div>
              {showExpForm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { name: "company_name", placeholder: "Company Name", required: true },
                    { name: "role", placeholder: "Role", required: true },
                    { name: "duration", placeholder: "Duration (e.g., Jan 2020 - Dec 2022)", required: true },
                    { name: "location", placeholder: "Location", required: false },
                    { name: "description", placeholder: "Description", required: false },
                  ].map((field) => (
                    <div key={field.name}>
                      <input
                        type="text"
                        name={field.name}
                        value={expForm[field.name]}
                        onChange={handleExpChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                        placeholder={field.placeholder}
                        required={field.required}
                        disabled={loading}
                      />
                    </div>
                  ))}
                  <div className="col-span-1 sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Save Experience
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {employee.experience?.map((exp, index) => (
                  <div
                    key={exp.id || index}
                    className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {exp.role} at {exp.company_name}
                      </p>
                      <p className="text-sm text-gray-600">{exp.duration}</p>
                      {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                      {exp.description && <p className="text-sm text-gray-600">{exp.description}</p>}
                    </div>
                    <button
                      onClick={() => handleRemoveExperience(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${exp.role} at ${exp.company_name}`}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Certifications</h3>
                <button
                  type="button"
                  onClick={() => setShowCertForm(!showCertForm)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  disabled={loading}
                >
                  {showCertForm ? "Cancel" : "Add Certification"}
                </button>
              </div>
              {showCertForm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                      placeholder="Certification Name (e.g., AWS Certified Developer)"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={certOrg}
                      onChange={(e) => setCertOrg(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                      placeholder="Issuing Organization (e.g., AWS)"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={certIssueDate}
                      onChange={(e) => setCertIssueDate(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                      placeholder="Issue Date"
                      disabled={loading}
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddCertification}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Save Certification
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                {employee.certifications?.map((cert, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {cert}
                    <button
                      onClick={() => handleRemoveCertification(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${cert}`}
                      disabled={loading}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </section>

            {/* Resume */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Resume</h3>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="w-full p-3 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300"
                disabled={loading}
              />
              {employee.resume && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Uploaded: {employee.resume.name}
                </p>
              )}
            </section>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Profile
                </>
              )}
            </button>
          </div>

          {/* Profile Preview */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2">
                  <strong>Name:</strong> {employee.fullName || "Not provided"}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {employee.email || "Not provided"}
                </p>
                <p className="mb-2">
                  <strong>Phone:</strong> {employee.phone || "Not provided"}
                </p>
                <p className="mb-2">
                  <strong>Location:</strong> {employee.location || userInfo.location || "Not provided"}
                </p>
                <p className="mb-2">
                  <strong>Gender:</strong> {employee.gender || "Not provided"}
                </p>
                {userInfo.company_name && (
                  <p className="mb-2">
                    <strong>Company:</strong> {userInfo.company_name || "Not provided"}
                  </p>
                )}
                {userInfo.position && (
                  <p className="mb-2">
                    <strong>Position:</strong> {userInfo.position || "Not provided"}
                  </p>
                )}
                {userInfo.about && (
                  <p className="mb-2">
                    <strong>About:</strong> {userInfo.about || "Not provided"}
                  </p>
                )}
              </div>
              <div>
                <p className="mb-2">
                  <strong>Skills:</strong>{" "}
                  {employee.skills?.length > 0 ? employee.skills.join(", ") : "None added"}
                </p>
                <div className="mb-2">
                  <strong>Education:</strong>
                  {employee.education?.length > 0 ? (
                    employee.education.map((edu, i) => (
                      <p key={edu.id || i} className="text-gray-600">
                        {edu.college}, {edu.university} ({edu.city}, {edu.state}) - {edu.duration}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-600">None added</p>
                  )}
                </div>
                <div className="mb-2">
                  <strong>Experience:</strong>
                  {employee.experience?.length > 0 ? (
                    employee.experience.map((exp, i) => (
                      <p key={exp.id || i} className="text-gray-600">
                        {exp.role} at {exp.company_name} ({exp.duration})
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-600">None added</p>
                  )}
                </div>
                <p>
                  <strong>Certifications:</strong>{" "}
                  {employee.certifications?.length > 0 ? employee.certifications.join(", ") : "None added"}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpProfile;