import React, { useState } from "react";

const CandidateDetails = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    graduationDegree: "",
    graduationState: "",
    graduationUniversity: "",
    graduationCollege: "", // New field for graduation college
    graduationYear: "",
    interBoard: "",
    interState: "",
    interStateBoard: "",
    interCollege: "", // New field for intermediate college
    interStream: "",
    interYear: "",
    tenthBoard: "",
    tenthState: "",
    tenthCollege: "", // New field for tenth college
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

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Reset dependent fields when state or board changes
    if (name === "graduationState") {
      setFormData({
        ...formData,
        graduationState: value,
        graduationUniversity: "", // Reset university when state changes
        [name]: value,
      });
    } else if (name === "interBoard") {
      setFormData({
        ...formData,
        interBoard: value,
        interStateBoard: value !== "State Board" ? "" : formData.interStateBoard, // Clear state board if not State Board
        [name]: value,
      });
    } else if (name === "interState") {
      setFormData({
        ...formData,
        interState: value,
        interBoard: "", // Reset board when state changes
        interStateBoard: "", // Reset state board when state changes
        [name]: value,
      });
    } else if (name === "tenthState") {
      setFormData({
        ...formData,
        tenthState: value,
        tenthBoard: "", // Reset board when state changes
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted successfully!");
  };

  // List of states (for state board and education state selection)
  const states = [
    "Select State",
    "Telangana",
    "Andhra Pradesh",
    "Karnataka",
    "Tamil Nadu",
    // Add more states as needed
  ];

  // List of Telangana universities (unchanged)
  const telanganaUniversities = [
    "Select University",
    "Osmania University",
    "Jawaharlal Nehru Technological University",
    "Kakatiya University",
    "University of Hyderabad",
    "Maulana Azad National Urdu University",
    "English and Foreign Languages University",
    "Sammakka Sarakka Central Tribal University",
    "Dr. B.R. Ambedkar Open University",
    "NALSAR University of Law",
    "Nizam’s Institute of Medical Sciences",
    "Mahatma Gandhi University",
    "Palamuru University",
    "Potti Sreeramulu Telugu University",
    "Professor Jayashankar Telangana State Agricultural University",
    "P.V. Narasimha Rao Telangana Veterinary University",
    "Rajiv Gandhi University of Knowledge Technologies",
    "Satavahana University",
    "Sri Konda Laxman Telangana State Horticultural University",
    "Telangana University",
    "Anurag University",
    "Mahindra University",
    "Malla Reddy University",
    "SR University",
    "Woxsen University",
    "Chaitanya (Deemed to be University)",
    "ICFAI Foundation for Higher Education",
    "International Institute of Information Technology",
    "Guru Nanak University",
    "Kaveri University",
    "MNR University",
    "NICMAR University of Construction Studies",
    "Sreenidhi University",
  ];

  // List of boards
  const boards = [
    "Select Board",
    "CBSE",
    "ICSE",
    "State Board",
  ];

  // List of state boards
  const stateBoards = [
    "Select State Board",
    ...states.filter((state) => state !== "Select State").map((state) => `${state} State Board`),
  ];

  // Dynamic universities based on selected state
  const universities = formData.graduationState === "Telangana" ? telanganaUniversities : ["Select University"];

  const steps = ["Personal", "Education", "Experience", "Location", "Resume"];

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
                name="graduationState"
                value={formData.graduationState}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
                required
              >
                {states.map((state, index) => (
                  <option
                    key={index}
                    value={state === "Select State" ? "" : state}
                    disabled={state === "Select State"}
                  >
                    {state}
                  </option>
                ))}
              </select>
              <select
                name="graduationUniversity"
                value={formData.graduationUniversity}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
                required
                disabled={!formData.graduationState}
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
                name="graduationCollege"
                placeholder="College Name (e.g., Osmania Engineering College)"
                value={formData.graduationCollege}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
              />
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
              <select
                name="interState"
                value={formData.interState}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              >
                {states.map((state, index) => (
                  <option
                    key={index}
                    value={state === "Select State" ? "" : state}
                    disabled={state === "Select State"}
                  >
                    {state}
                  </option>
                ))}
              </select>
              <select
                name="interBoard"
                value={formData.interBoard}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
                required
                disabled={!formData.interState}
              >
                {boards.map((board, index) => (
                  <option
                    key={index}
                    value={board === "Select Board" ? "" : board}
                    disabled={board === "Select Board"}
                  >
                    {board}
                  </option>
                ))}
              </select>
              {formData.interBoard === "State Board" && (
                <select
                  name="interStateBoard"
                  value={formData.interStateBoard}
                  onChange={handleChange}
                  className="border p-2 w-full rounded mt-2"
                  required
                >
                  {stateBoards.map((stateBoard, index) => (
                    <option
                      key={index}
                      value={stateBoard === "Select State Board" ? "" : stateBoard}
                      disabled={stateBoard === "Select State Board"}
                    >
                      {stateBoard}
                    </option>
                  ))}
                </select>
              )}
              <input
                type="text"
                name="interCollege"
                placeholder="College Name (e.g., St. Mary's Junior College)"
                value={formData.interCollege}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
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
              <select
                name="tenthState"
                value={formData.tenthState}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              >
                {states.map((state, index) => (
                  <option
                    key={index}
                    value={state === "Select State" ? "" : state}
                    disabled={state === "Select State"}
                  >
                    {state}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="tenthBoard"
                placeholder="Board (e.g., CBSE, ICSE)"
                value={formData.tenthBoard}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
                required
              />
              <input
                type="text"
                name="tenthCollege"
                placeholder="School Name (e.g., Hyderabad Public School)"
                value={formData.tenthCollege}
                onChange={handleChange}
                className="border p-2 w-full rounded mt-2"
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