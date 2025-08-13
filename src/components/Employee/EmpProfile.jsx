import React, { useState } from "react";

export default function EmpProfile() {
  const [educations, setEducations] = useState([]);
  const [educationInput, setEducationInput] = useState({ degree: "", institute: "", year: "" });

  const [experiences, setExperiences] = useState([]);
  const [experienceInput, setExperienceInput] = useState({ role: "", company: "", duration: "" });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [locations, setLocations] = useState([]);
  const [locationInput, setLocationInput] = useState("");

  const [resume, setResume] = useState(null);

  const addEducation = () => {
    if (educationInput.degree && educationInput.institute && educationInput.year) {
      setEducations([...educations, educationInput]);
      setEducationInput({ degree: "", institute: "", year: "" });
    }
  };

  const addExperience = () => {
    if (experienceInput.role && experienceInput.company && experienceInput.duration) {
      setExperiences([...experiences, experienceInput]);
      setExperienceInput({ role: "", company: "", duration: "" });
    }
  };

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const addLocation = () => {
    if (locationInput && !locations.includes(locationInput)) {
      setLocations([...locations, locationInput]);
      setLocationInput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-8">
      {/* Basic Info */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Info</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Headline"
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="file"
          className="border p-2 w-full mb-2 rounded"
        />
      </section>

      {/* Education */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
          Education
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={addEducation}
          >
            Add
          </button>
        </h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Degree"
            value={educationInput.degree}
            onChange={(e) => setEducationInput({ ...educationInput, degree: e.target.value })}
            className="border p-2 flex-1 rounded"
          />
          <input
            type="text"
            placeholder="Institute"
            value={educationInput.institute}
            onChange={(e) => setEducationInput({ ...educationInput, institute: e.target.value })}
            className="border p-2 flex-1 rounded"
          />
          <input
            type="text"
            placeholder="Year"
            value={educationInput.year}
            onChange={(e) => setEducationInput({ ...educationInput, year: e.target.value })}
            className="border p-2 w-28 rounded"
          />
        </div>
        <ul className="list-disc pl-5">
          {educations.map((edu, idx) => (
            <li key={idx}>{edu.degree} - {edu.institute} ({edu.year})</li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
          Experience
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={addExperience}
          >
            Add
          </button>
        </h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Role"
            value={experienceInput.role}
            onChange={(e) => setExperienceInput({ ...experienceInput, role: e.target.value })}
            className="border p-2 flex-1 rounded"
          />
          <input
            type="text"
            placeholder="Company"
            value={experienceInput.company}
            onChange={(e) => setExperienceInput({ ...experienceInput, company: e.target.value })}
            className="border p-2 flex-1 rounded"
          />
          <input
            type="text"
            placeholder="Duration"
            value={experienceInput.duration}
            onChange={(e) => setExperienceInput({ ...experienceInput, duration: e.target.value })}
            className="border p-2 w-28 rounded"
          />
        </div>
        <ul className="list-disc pl-5">
          {experiences.map((exp, idx) => (
            <li key={idx}>{exp.role} at {exp.company} ({exp.duration})</li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Enter a skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="border p-2 flex-1 rounded"
          />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={addSkill}
          >
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Preferred Locations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Preferred Locations</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Enter location"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="border p-2 flex-1 rounded"
          />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={addLocation}
          >
            +
          </button>
        </div>
        <ul className="list-disc pl-5">
          {locations.map((loc, idx) => (
            <li key={idx}>{loc}</li>
          ))}
        </ul>
      </section>

      {/* Resume */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Resume</h2>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
          className="border p-2 w-full rounded"
        />
        {resume && <p className="mt-2 text-sm text-gray-600">Uploaded: {resume.name}</p>}
      </section>

      {/* Save Button */}
      <div className="text-right">
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Save Profile
        </button>
      </div>
    </div>
  );
}
