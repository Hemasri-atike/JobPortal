import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadCandidate, saveCandidate } from "../../store/candidateSlice.js";

const CandidateDetails = ({ candidateId }) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.candidate);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    graduationDegree: "",
    graduationState: "",
    graduationUniversity: "",
    graduationCollege: "",
    graduationYear: "",
    interBoard: "",
    interState: "",
    interStateBoard: "",
    interCollege: "",
    interStream: "",
    interYear: "",
    tenthBoard: "",
    tenthState: "",
    tenthCollege: "",
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

  // Load candidate from Redux if candidateId is provided
  useEffect(() => {
    if (candidateId) dispatch(loadCandidate(candidateId));
  }, [candidateId, dispatch]);

  // Populate formData from Redux
  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleNext = () => step < 5 && setStep(step + 1);
  const handlePrev = () => step > 1 && setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    // If resume is a file, use FormData to send to backend
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      payload.append(key, val);
    });

    dispatch(saveCandidate(payload));
    alert("Candidate saved successfully!");
  };

  const steps = ["Personal", "Education", "Experience", "Location", "Resume"];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Stepper */}
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
            <p className={`mt-2 text-sm ${step === index + 1 ? "text-blue-600 font-bold" : "text-gray-500"}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal */}
        {step === 1 && (
          <div className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="border p-2 w-full rounded" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="border p-2 w-full rounded" required />
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="border p-2 w-full rounded" required />
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Graduation Details</h3>
            <input type="text" name="graduationDegree" value={formData.graduationDegree} onChange={handleChange} placeholder="Degree (B.Tech, B.Sc)" className="border p-2 w-full rounded" required />
            <input type="text" name="graduationState" value={formData.graduationState} onChange={handleChange} placeholder="State" className="border p-2 w-full rounded" required />
            <input type="text" name="graduationUniversity" value={formData.graduationUniversity} onChange={handleChange} placeholder="University" className="border p-2 w-full rounded" required />
            <input type="text" name="graduationCollege" value={formData.graduationCollege} onChange={handleChange} placeholder="College" className="border p-2 w-full rounded" required />
            <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} placeholder="Year of Completion" className="border p-2 w-full rounded" required />

            <h3 className="font-semibold">Intermediate Details</h3>
            <input type="text" name="interBoard" value={formData.interBoard} onChange={handleChange} placeholder="Board" className="border p-2 w-full rounded" required />
            <input type="text" name="interState" value={formData.interState} onChange={handleChange} placeholder="State" className="border p-2 w-full rounded" required />
            <input type="text" name="interStateBoard" value={formData.interStateBoard} onChange={handleChange} placeholder="State Board (if applicable)" className="border p-2 w-full rounded" />
            <input type="text" name="interCollege" value={formData.interCollege} onChange={handleChange} placeholder="College" className="border p-2 w-full rounded" required />
            <input type="text" name="interStream" value={formData.interStream} onChange={handleChange} placeholder="Stream" className="border p-2 w-full rounded" required />
            <input type="text" name="interYear" value={formData.interYear} onChange={handleChange} placeholder="Year of Completion" className="border p-2 w-full rounded" required />

            <h3 className="font-semibold">Tenth Details</h3>
            <input type="text" name="tenthBoard" value={formData.tenthBoard} onChange={handleChange} placeholder="Board" className="border p-2 w-full rounded" required />
            <input type="text" name="tenthState" value={formData.tenthState} onChange={handleChange} placeholder="State" className="border p-2 w-full rounded" required />
            <input type="text" name="tenthCollege" value={formData.tenthCollege} onChange={handleChange} placeholder="School" className="border p-2 w-full rounded" required />
            <input type="text" name="tenthYear" value={formData.tenthYear} onChange={handleChange} placeholder="Year of Completion" className="border p-2 w-full rounded" required />
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div className="space-y-4">
            <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="Work Experience" className="border p-2 w-full rounded" />
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" className="border p-2 w-full rounded" />
            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Job Title" className="border p-2 w-full rounded" />
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration" className="border p-2 w-full rounded" />
            <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} placeholder="Responsibilities" className="border p-2 w-full rounded" rows="4" />
          </div>
        )}

        {/* Step 4: Location */}
        {step === 4 && (
          <div className="space-y-4">
            <input type="text" name="currentLocation" value={formData.currentLocation} onChange={handleChange} placeholder="Current Location" className="border p-2 w-full rounded" required />
            <input type="text" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange} placeholder="Preferred Location" className="border p-2 w-full rounded" required />
          </div>
        )}

        {/* Step 5: Resume */}
        {step === 5 && (
          <div className="space-y-4">
            <input type="file" name="resume" onChange={handleChange} accept=".pdf,.doc,.docx" className="border p-2 w-full rounded" />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button type="button" onClick={handlePrev} className="bg-gray-400 text-white px-4 py-2 rounded">Previous</button>
          )}
          {step < 5 ? (
            <button type="button" onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
          ) : (
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CandidateDetails;
