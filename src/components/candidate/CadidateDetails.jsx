import React, { useState } from "react";

const CandidateDetails = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    graduationDegree: "",
    graduationUniversity: "",
    graduationYear: "",
    interBoard: "",
    interStream: "",
    interYear: "",
    tenthBoard: "",
    tenthYear: "",
    experience: "", // Existing field, will keep for compatibility
    companyName: "", // New field for Experience step
    jobTitle: "", // New field for Experience step
    duration: "", // New field for Experience step
    responsibilities: "", // New field for Experience step
    currentLocation: "",
    preferredLocation: "",
    resume: null,
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1); // Updated to account for 5 steps
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted successfully!");
  };

  // Sample list of universities (replace with your actual list)
  const universities = [
    "Select University",
    "Harvard University",
    "Stanford University",
    "Massachusetts Institute of Technology",
    "University of Oxford",
    "University of Cambridge",
    "Indian Institute of Technology, Delhi",
    "Indian Institute of Technology, Bombay",
    "University of Delhi",
    "Jawaharlal Nehru University",
    "Anna University",
    // Add more universities as needed
  ];

  const steps = ["Personal", "Education", "Experience", "Location", "Resume"]; // Added Experience step

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Stepper Header */}
      <div className="flex justify-between mb-6">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full ${
                step === index + 1
                  ? "bg-blue-600 text-white"
                  : step > index + 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`mt-2 text-sm ${
                step === index + 1 ? "text-blue-600 font-bold" : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Graduation Details */}
            <div>
              <h3 className="text-md font-semibold mb-2">Graduation Details</h3>
              <input
                type="text"
                name="graduationDegree"
                placeholder="Degree (e.g., B.Tech, B.Sc)"
                value={formData.graduationDegree}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
              <select
                name="graduationUniversity"
                value={formData.graduationUniversity}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
                required
              >
                {universities.map((university, index) => (
                  <option
                    key={index}
                    value={university === "Select University" ? "" : university}
                    disabled={university === "Select University"}
                  >
                    {university}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="graduationYear"
                placeholder="Year of Completion (e.g., 2023)"
                value={formData.graduationYear}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
                required
              />
            </div>

            {/* Intermediate Details */}
            <div>
              <h3 className="text-md font-semibold mb-2">Intermediate Details</h3>
              <input
                type="text"
                name="interBoard"
                placeholder="Board (e.g., CBSE, State Board)"
                value={formData.interBoard}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="text"
                name="interStream"
                placeholder="Stream (e.g., Science, Commerce)"
                value={formData.interStream}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
                required
              />
              <input
                type="text"
                name="interYear"
                placeholder="Year of Completion (e.g., 2019)"
                value={formData.interYear}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
                required
              />
            </div>

            {/* Tenth Details */}
            <div>
              <h3 className="text-md font-semibold mb-2">Tenth Details</h3>
              <input
                type="text"
                name="tenthBoard"
                placeholder="Board (e.g., CBSE, ICSE)"
                value={formData.tenthBoard}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
              <input
                type="text"
                name="tenthYear"
                placeholder="Year of Completion (e.g., 2017)"
                value={formData.tenthYear}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
                required
              />
            </div>

            {/* Experience */}
            <input
              type="text"
              name="experience"
              placeholder="Work Experience (e.g., 2 years)"
              value={formData.experience}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold mb-2">Work Experience Details</h3>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name (e.g., TechCorp)"
              value={formData.companyName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title (e.g., Software Engineer)"
              value={formData.jobTitle}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-2"
            />
            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
              value={formData.duration}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-2"
            />
            <textarea
              name="responsibilities"
              placeholder="Key Responsibilities (e.g., Developed web applications, led team projects)"
              value={formData.responsibilities}
              onChange={handleChange}
              className="border p-2 w-full rounded mt-2"
              rows="4"
            />
          </div>
        )}

        {/* Step 4: Location */}
        {step === 4 && (
          <div className="space-y-4">
            <input
              type="text"
              name="currentLocation"
              placeholder="Current Location"
              value={formData.currentLocation}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              name="preferredLocation"
              placeholder="Preferred Job Location"
              value={formData.preferredLocation}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
        )}

        {/* Step 5: Resume */}
        {step === 5 && (
          <div className="space-y-4">
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
          )}
          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CandidateDetails;