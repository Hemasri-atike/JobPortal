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
  <div className="flex items-center justify-between relative mb-8">
  {steps.map((label, index) => (
    <div key={label} className="flex-1 flex flex-col items-center relative">
      {/* Circle */}
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

      {/* Label */}
      <p
        className={`mt-2 text-sm ${
          step === index + 1 ? "text-blue-600 font-bold" : "text-gray-500"
        }`}
      >
        {label}
      </p>

      {/* Progress Line */}
      {index < steps.length - 1 && (
        <div
          className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${
            step > index + 1 ? "bg-green-500" : "bg-gray-300"
          }`}
        ></div>
      )}
    </div>
  ))}
</div>

  );
};

export default CandidateDetails;
