import React, { useState } from "react";
import { PlusCircleIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";

export default function EmpProfile() {
  const [educations, setEducations] = useState([]);
  const [educationInput, setEducationInput] = useState({
    degree: "",
    institute: "",
    year: "",
    state: "",
    university: "",
    college: "",
    duration: { from: { day: "", month: "", year: "" }, to: { day: "", month: "", year: "" } },
  });

  const [experiences, setExperiences] = useState([]);
  const [experienceInput, setExperienceInput] = useState({
    role: "",
    company: "",
    location: "", // Added company location
    duration: { from: { day: "", month: "", year: "" }, to: { day: "", month: "", year: "" } },
    empType: "",
    employeeId: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [locationInput, setLocationInput] = useState({
    presentAddress: "",
    permanentAddress: "",
  });

  const [resume, setResume] = useState(null);

  const addEducation = () => {
    if (
      educationInput.degree &&
      educationInput.institute &&
      educationInput.year &&
      educationInput.state &&
      educationInput.university &&
      educationInput.college &&
      educationInput.duration.from.day &&
      educationInput.duration.from.month &&
      educationInput.duration.from.year &&
      educationInput.duration.to.day &&
      educationInput.duration.to.month &&
      educationInput.duration.to.year
    ) {
      setEducations([...educations, educationInput]);
      setEducationInput({
        degree: "",
        institute: "",
        year: "",
        state: "",
        university: "",
        college: "",
        duration: { from: { day: "", month: "", year: "" }, to: { day: "", month: "", year: "" } },
      });
    }
  };

  const addExperience = () => {
    if (
      experienceInput.role &&
      experienceInput.company &&
      experienceInput.location && // Added validation for location
      experienceInput.duration.from.day &&
      experienceInput.duration.from.month &&
      experienceInput.duration.from.year &&
      experienceInput.duration.to.day &&
      experienceInput.duration.to.month &&
      experienceInput.duration.to.year &&
      experienceInput.empType &&
      experienceInput.employeeId
    ) {
      setExperiences([...experiences, experienceInput]);
      setExperienceInput({
        role: "",
        company: "",
        location: "", // Reset location
        duration: { from: { day: "", month: "", year: "" }, to: { day: "", month: "", year: "" } },
        empType: "",
        employeeId: "",
      });
    }
  };

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  // Helper arrays for date picker options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  // Sample list of US states for the dropdown
  const states = [
  // US States
  // "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  // "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  // "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  // "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  // "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  // "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  // "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  // "Wisconsin", "Wyoming",

  // Indian States
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];


  // Format date for display
  const formatDate = (date) => {
    if (!date.day || !date.month || !date.year) return "";
    return `${date.day} ${date.month} ${date.year}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
        {/* Basic Info */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
              <input
                type="text"
                placeholder="E.g., Software Engineer"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <input
                type="file"
                className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition"
              />
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
            Education
            <button
              onClick={addEducation}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Education
            </button>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input
                type="text"
                placeholder="E.g., B.Sc. Computer Science"
                value={educationInput.degree}
                onChange={(e) => setEducationInput({ ...educationInput, degree: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
              <input
                type="text"
                placeholder="E.g., XYZ Institute"
                value={educationInput.institute}
                onChange={(e) => setEducationInput({ ...educationInput, institute: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                placeholder="E.g., 2020"
                value={educationInput.year}
                onChange={(e) => setEducationInput({ ...educationInput, year: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={educationInput.state}
                onChange={(e) => setEducationInput({ ...educationInput, state: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input
                type="text"
                placeholder="E.g., ABC University"
                value={educationInput.university}
                onChange={(e) => setEducationInput({ ...educationInput, university: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
              <input
                type="text"
                placeholder="E.g., DEF College"
                value={educationInput.college}
                onChange={(e) => setEducationInput({ ...educationInput, college: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                  <div className="flex gap-2">
                    <select
                      value={educationInput.duration.from.day}
                      onChange={(e) =>
                        setEducationInput({
                          ...educationInput,
                          duration: {
                            ...educationInput.duration,
                            from: { ...educationInput.duration.from, day: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Day</option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      value={educationInput.duration.from.month}
                      onChange={(e) =>
                        setEducationInput({
                          ...educationInput,
                          duration: {
                            ...educationInput.duration,
                            from: { ...educationInput.duration.from, month: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={educationInput.duration.from.year}
                      onChange={(e) =>
                        setEducationInput({
                          ...educationInput,
                          duration: {
                            ...educationInput.duration,
                            from: { ...educationInput.duration.from, year: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                  <div className="flex gap-2">
                    <select
                      value={educationInput.duration.to.day}
                      onChange={(e) =>
                        setEducationInput({
                          ...educationInput,
                          duration: {
                            ...educationInput.duration,
                            to: { ...educationInput.duration.to, day: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Day</option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      value={educationInput.duration.to.month}
                      onChange={(e) =>
                        setEducationInput({
                          ...educationInput,
                          duration: {
                            ...educationInput.duration,
                            to: { ...educationInput.duration.to, month: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={educationInput.duration.to.year}
                      onChange={(e) =>
                        setEducationInput({
                          ...educationInput,
                          duration: {
                            ...educationInput.duration,
                            to: { ...educationInput.duration.to, year: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {educations.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Added Education</h3>
              <div className="space-y-2">
                {educations.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    {edu.degree} - {edu.institute}, {edu.college}, {edu.university}, {edu.state} (
                    {edu.year}, {formatDate(edu.duration.from)} - {formatDate(edu.duration.to)})
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Experience */}
        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
            Experience
            <button
              onClick={addExperience}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Experience
            </button>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                placeholder="E.g., Software Engineer"
                value={experienceInput.role}
                onChange={(e) => setExperienceInput({ ...experienceInput, role: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                placeholder="E.g., ABC Corp"
                value={experienceInput.company}
                onChange={(e) => setExperienceInput({ ...experienceInput, company: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="E.g., San Francisco, CA"
                value={experienceInput.location}
                onChange={(e) => setExperienceInput({ ...experienceInput, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                  <div className="flex gap-2">
                    <select
                      value={experienceInput.duration.from.day}
                      onChange={(e) =>
                        setExperienceInput({
                          ...experienceInput,
                          duration: {
                            ...experienceInput.duration,
                            from: { ...experienceInput.duration.from, day: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Day</option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      value={experienceInput.duration.from.month}
                      onChange={(e) =>
                        setExperienceInput({
                          ...experienceInput,
                          duration: {
                            ...experienceInput.duration,
                            from: { ...experienceInput.duration.from, month: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={experienceInput.duration.from.year}
                      onChange={(e) =>
                        setExperienceInput({
                          ...experienceInput,
                          duration: {
                            ...experienceInput.duration,
                            from: { ...experienceInput.duration.from, year: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                  <div className="flex gap-2">
                    <select
                      value={experienceInput.duration.to.day}
                      onChange={(e) =>
                        setExperienceInput({
                          ...experienceInput,
                          duration: {
                            ...experienceInput.duration,
                            to: { ...experienceInput.duration.to, day: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Day</option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      value={experienceInput.duration.to.month}
                      onChange={(e) =>
                        setExperienceInput({
                          ...experienceInput,
                          duration: {
                            ...experienceInput.duration,
                            to: { ...experienceInput.duration.to, month: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={experienceInput.duration.to.year}
                      onChange={(e) =>
                        setExperienceInput({
                          ...experienceInput,
                          duration: {
                            ...experienceInput.duration,
                            to: { ...experienceInput.duration.to, year: e.target.value },
                          },
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <input
                type="text"
                placeholder="E.g., Full-time"
                value={experienceInput.empType}
                onChange={(e) => setExperienceInput({ ...experienceInput, empType: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                placeholder="E.g., EMP12345"
                value={experienceInput.employeeId}
                onChange={(e) => setExperienceInput({ ...experienceInput, employeeId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
          {experiences.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Added Experience</h3>
              <div className="space-y-2">
                {experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    {exp.role} at {exp.company}, {exp.location} ({formatDate(exp.duration.from)} -{" "}
                    {formatDate(exp.duration.to)}, {exp.empType}, ID: {exp.employeeId})
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Skills */}
        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter a skill, e.g., JavaScript"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <button
              onClick={addSkill}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add
            </button>
          </div>
          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Addresses */}
        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Addresses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Present Address</label>
              <input
                type="text"
                placeholder="E.g., 123 Main St, City"
                value={locationInput.presentAddress}
                onChange={(e) => setLocationInput({ ...locationInput, presentAddress: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
              <input
                type="text"
                placeholder="E.g., 456 Oak Ave, City"
                value={locationInput.permanentAddress}
                onChange={(e) => setLocationInput({ ...locationInput, permanentAddress: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </section>

        {/* Resume */}
        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resume</h2>
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="flex items-center text-blue-600 cursor-pointer hover:text-blue-700 transition"
            >
              <DocumentArrowUpIcon className="w-6 h-6 mr-2" />
              {resume ? resume.name : "Upload Resume (PDF, DOC, DOCX)"}
            </label>
          </div>
          {resume && <p className="mt-2 text-sm text-gray-600">Uploaded: {resume.name}</p>}
        </section>

        {/* Save Button */}
        <div className="text-right">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}