// src/pages/employee/EmpProfile.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../pages/cvdetails/layout/Sidebar.jsx";
import Header from "../../pages/navbar/Header.jsx";
import {
  updateField,
  addSkill,
  addEducation,
  addExperience,
  addCertification,
  setResume,
  setAllFields,
} from "../../store/empprofileSlice.js";
import { saveEmployeeProfile, uploadResume } from "../../api/empapi.js";

const EmpProfile = () => {
  const dispatch = useDispatch();
  const employee = useSelector((state) => state.employee);

  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [eduInput, setEduInput] = useState({
    state: "",
    city: "",
    university: "",
    college: "",
    duration: "",
  });
  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    city: "",
    state: "",
    country: "",
  });
  

  // ----------------- Handlers -----------------
  const handleChange = (e) =>
    dispatch(updateField({ field: e.target.name, value: e.target.value }));

  const handleEduChange = (e) =>
    setEduInput({ ...eduInput, [e.target.name]: e.target.value });

  const handleExpChange = (e) =>
    setExpForm({ ...expForm, [e.target.name]: e.target.value });

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      dispatch(addSkill(skillInput));
      setSkillInput("");
    }
  };

  const handleAddEducation = () => {
    const { state, city, university, college, duration } = eduInput;
    if (state && city && university && college && duration) {
      dispatch(addEducation(eduInput));
      setEduInput({ state: "", city: "", university: "", college: "", duration: "" });
    }
  };

  const handleAddExperience = () => {
    if (expForm.company && expForm.role) {
      dispatch(addExperience(expForm));
      setExpForm({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        city: "",
        state: "",
        country: "",
      });
    }
  };

  const handleAddCertification = () => {
    if (certInput.trim()) {
      dispatch(addCertification(certInput));
      setCertInput("");
    }
  };

  const handleResumeUpload = (e) => dispatch(setResume(e.target.files[0]));

  // ----------------- Save & Fetch Backend -----------------
  const handleSaveProfile = async () => {
    try {
      // Save employee profile
      const savedProfile = await saveEmployeeProfile(employee);

      // Upload resume if exists
      if (employee.resume) {
        await uploadResume(savedProfile.employeeId, employee.resume);
      }

      // Update Redux with backend-saved profile
      dispatch(setAllFields(savedProfile));

      alert("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  };

  // ----------------- JSX -----------------
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex pt-4">
        {/* Sidebar */}
        <div className="w-64">
          <Sidebar role="employee" />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Profile</h2>

          {/* ----------------- Personal Details ----------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
              { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
              { label: "Phone", name: "phone", type: "tel", placeholder: "Enter your phone number" },
              { label: "Date of Birth", name: "dob", type: "date" },
              { label: "Location", name: "location", type: "text", placeholder: "Enter your location" },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={employee[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={employee.gender || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* ----------------- Skills ----------------- */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Enter a skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {employee.skills?.map((skill, index) => (
                <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* ----------------- Education ----------------- */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["state", "city", "university", "college", "duration"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={eduInput[field]}
                  onChange={handleEduChange}
                  className="border p-2 rounded"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddEducation}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Education
            </button>
            <div className="mt-4 space-y-3">
              {employee.education?.map((edu, index) => (
                <div key={index} className="p-3 border rounded bg-gray-50 shadow-sm">
                  <p className="text-sm font-medium">{edu.college}, {edu.university}</p>
                  <p className="text-xs text-gray-600">{edu.city}, {edu.state} • {edu.duration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ----------------- Experience ----------------- */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Experience</h3>
            <div className="grid grid-cols-2 gap-4">
              {["company", "role", "startDate", "endDate", "city", "state", "country"].map((field) => (
                <input
                  key={field}
                  type={field.includes("Date") ? "date" : "text"}
                  name={field}
                  value={expForm[field]}
                  onChange={handleExpChange}
                  className="border p-2 rounded"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddExperience}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Experience
            </button>
            <div className="mt-4 space-y-3">
              {employee.experience?.map((exp, index) => (
                <div key={index} className="p-3 border rounded bg-gray-50 shadow-sm">
                  <p className="font-semibold">{exp.role} at {exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate || "Present"}</p>
                  <p className="text-sm text-gray-600">{exp.city}, {exp.state}, {exp.country}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ----------------- Resume ----------------- */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="w-full border p-2 rounded mt-1"
            />
            {employee.resume && (
              <p className="mt-2 text-sm text-green-600">Uploaded: {employee.resume.name}</p>
            )}
          </div>

          {/* ----------------- Certifications ----------------- */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Certifications</label>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Enter certification name"
              />
              <button
                type="button"
                onClick={handleAddCertification}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {employee.certifications?.map((cert, index) => (
                <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800">
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* ----------------- Save Button ----------------- */}
          <button
            onClick={handleSaveProfile}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 mb-6"
          >
            Save Profile
          </button>

          {/* ----------------- Backend Profile Preview ----------------- */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Saved Profile (from Backend)</h3>
            <p><strong>Name:</strong> {employee.fullName}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Location:</strong> {employee.location}</p>
            <p><strong>Gender:</strong> {employee.gender}</p>
            <div><strong>Skills:</strong> {employee.skills?.join(", ")}</div>
            <div>
              <strong>Education:</strong>
              {employee.education?.map((edu, i) => (
                <p key={i}>{edu.college}, {edu.university} ({edu.city}, {edu.state}) - {edu.duration}</p>
              ))}
            </div>
            <div>
              <strong>Experience:</strong>
              {employee.experience?.map((exp, i) => (
                <p key={i}>{exp.role} at {exp.company} ({exp.startDate} - {exp.endDate || "Present"})</p>
              ))}
            </div>
            <div><strong>Certifications:</strong> {employee.certifications?.join(", ")}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpProfile;
