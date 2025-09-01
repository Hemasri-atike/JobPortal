import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadCandidate, saveCandidate, clearCandidateMessages } from "../../store/candidateSlice.js";
import statesWithCities from "../common/Statesncities.jsx";

const CandidateDetails = ({ candidateId }) => {
  const dispatch = useDispatch();
  const { data, loading, success, error } = useSelector((state) => state.candidate);

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

  // Load candidate from backend
  useEffect(() => {
    if (candidateId) dispatch(loadCandidate(candidateId));
  }, [candidateId, dispatch]);

  // Merge backend data safely
  useEffect(() => {
    if (data) setFormData((prev) => ({ ...prev, ...data }));
  }, [data]);

  // Show success/error alerts
  useEffect(() => {
    if (success) {
      alert(success);
      dispatch(clearCandidateMessages());
    }
    if (error) {
      alert(error);
      dispatch(clearCandidateMessages());
    }
  }, [success, error, dispatch]);

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
  const payload = new FormData();
  Object.entries(formData).forEach(([key, val]) => {
    payload.append(key, val ?? "");
  });
  dispatch(saveCandidate(payload));
};


  const steps = ["Personal", "Education", "Experience", "Location", "Resume"];

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* Progress Steps */}
      <div className="flex items-center justify-between relative mb-8">
        {steps.map((label, index) => (
          <div key={label} className="flex-1 flex flex-col items-center relative">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full z-10 ${
                step === index + 1
                  ? "bg-blue-600 text-white shadow-lg scale-110 transition-all"
                  : step > index + 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <p className={`mt-2 text-sm ${step === index + 1 ? "text-blue-600 font-bold" : "text-gray-500"}`}>
              {label}
            </p>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${step > index + 1 ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded" />
          <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
          <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
        </div>
      )}

      {/* Step 2: Education */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Graduation */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-2">Graduation</h3>
            <input name="graduationDegree" value={formData.graduationDegree || ""} onChange={handleChange} placeholder="Degree" className="border p-2 rounded w-full mb-2" />
            <select name="graduationState" value={formData.graduationState || ""} onChange={handleChange} className="border p-2 rounded w-full mb-2">
              <option value="">Select State</option>
              {Object.keys(statesWithCities).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <select name="graduationCity" value={formData.graduationCity || ""} onChange={handleChange} className="border p-2 rounded w-full mb-2">
              <option value="">Select City</option>
              {statesWithCities[formData.graduationState]?.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <input name="graduationUniversity" value={formData.graduationUniversity || ""} onChange={handleChange} placeholder="University" className="border p-2 rounded w-full mb-2" />
            <input name="graduationCollege" value={formData.graduationCollege || ""} onChange={handleChange} placeholder="College" className="border p-2 rounded w-full mb-2" />
            <input name="graduationYear" value={formData.graduationYear || ""} onChange={handleChange} placeholder="Year" className="border p-2 rounded w-full" />
          </div>

          {/* Intermediate */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-2">Intermediate</h3>
            <input name="interBoard" value={formData.interBoard || ""} onChange={handleChange} placeholder="Board" className="border p-2 rounded w-full mb-2" />
            <select name="interState" value={formData.interState || ""} onChange={handleChange} className="border p-2 rounded w-full mb-2">
              <option value="">Select State</option>
              {Object.keys(statesWithCities).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <input name="interStateBoard" value={formData.interStateBoard || ""} onChange={handleChange} placeholder="State Board" className="border p-2 rounded w-full mb-2" />
            <select name="interCity" value={formData.interCity || ""} onChange={handleChange} className="border p-2 rounded w-full mb-2">
              <option value="">Select City</option>
              {statesWithCities[formData.interState]?.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <input name="interCollege" value={formData.interCollege || ""} onChange={handleChange} placeholder="College" className="border p-2 rounded w-full mb-2" />
            <input name="interStream" value={formData.interStream || ""} onChange={handleChange} placeholder="Stream" className="border p-2 rounded w-full mb-2" />
            <input name="interYear" value={formData.interYear || ""} onChange={handleChange} placeholder="Year" className="border p-2 rounded w-full" />
          </div>

          {/* 10th */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-2">10th</h3>
            <input name="tenthBoard" value={formData.tenthBoard || ""} onChange={handleChange} placeholder="Board" className="border p-2 rounded w-full mb-2" />
            <select name="tenthState" value={formData.tenthState || ""} onChange={handleChange} className="border p-2 rounded w-full mb-2">
              <option value="">Select State</option>
              {Object.keys(statesWithCities).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <select name="tenthCity" value={formData.tenthCity || ""} onChange={handleChange} className="border p-2 rounded w-full mb-2">
              <option value="">Select City</option>
              {statesWithCities[formData.tenthState]?.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <input name="tenthSchool" value={formData.tenthSchool || ""} onChange={handleChange} placeholder="School" className="border p-2 rounded w-full mb-2" />
            <input name="tenthYear" value={formData.tenthYear || ""} onChange={handleChange} placeholder="Year" className="border p-2 rounded w-full" />
          </div>
        </div>
      )}

      {/* Step 3: Experience */}
      {step === 3 && (
        <div className="space-y-4">
          <input name="experience" value={formData.experience || ""} onChange={handleChange} placeholder="Years of Experience" className="border p-2 rounded w-full" />
          <input name="companyName" value={formData.companyName || ""} onChange={handleChange} placeholder="Company Name" className="border p-2 rounded w-full" />
          <input name="jobTitle" value={formData.jobTitle || ""} onChange={handleChange} placeholder="Job Title" className="border p-2 rounded w-full" />
          <input name="duration" value={formData.duration || ""} onChange={handleChange} placeholder="Duration" className="border p-2 rounded w-full" />
          <textarea name="responsibilities" value={formData.responsibilities || ""} onChange={handleChange} placeholder="Responsibilities" className="border p-2 rounded w-full"></textarea>
        </div>
      )}

      {/* Step 4: Location */}
      {step === 4 && (
        <div className="space-y-4">
          <input name="currentLocation" value={formData.currentLocation || ""} onChange={handleChange} placeholder="Current Location" className="border p-2 rounded w-full" />
          <input name="preferredLocation" value={formData.preferredLocation || ""} onChange={handleChange} placeholder="Preferred Location" className="border p-2 rounded w-full" />
        </div>
      )}

      {/* Step 5: Resume */}
      {step === 5 && (
        <div className="space-y-4">
          <input type="file" name="resume" onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button type="button" onClick={handlePrev} className="px-4 py-2 bg-gray-400 rounded">
            Previous
          </button>
        )}
        {step < steps.length ? (
          <button type="button" onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">
            Next
          </button>
        ) : (
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            Submit
          </button>
        )}
      </div>
    </form>
  );
};

export default CandidateDetails;
