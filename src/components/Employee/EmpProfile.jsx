import React, { useState } from "react";

const EmpProfile = () => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName) {
      alert("Please enter your full name");
      return;
    }
    console.log({
      fullName,
      gender,
      education,
      experience,
      city,
    });
  };

  const buttonClasses =
    "px-4 py-2 border rounded-full text-sm hover:bg-blue-500 hover:text-white transition";

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-start py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl"
      >
        {/* Progress bar */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-4 w-full max-w-sm">
            <div className="flex-1 h-1 bg-teal-400 rounded"></div>
            <div className="flex-1 h-1 bg-teal-200 rounded"></div>
            <div className="flex-1 h-1 bg-teal-200 rounded"></div>
            <div className="flex-1 h-1 bg-teal-200 rounded"></div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Make your profile</h2>

        {/* Full Name */}
        <label className="block font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter Full Name"
          className={`w-full border rounded px-3 py-2 mt-1 ${
            !fullName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {!fullName && (
          <p className="text-red-500 text-sm">Enter Full Name</p>
        )}

        {/* Gender */}
        <div className="mt-4">
          <label className="block font-medium">Gender</label>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setGender("Male")}
              className={`${buttonClasses} ${
                gender === "Male" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender("Female")}
              className={`${buttonClasses} ${
                gender === "Female" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* Education */}
        <div className="mt-4">
          <label className="block font-medium">Education level</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {["Below 10th", "10th Pass", "12th Pass", "Diploma", "Graduate", "Post Graduate"].map(
              (level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEducation(level)}
                  className={`${buttonClasses} ${
                    education === level ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {level}
                </button>
              )
            )}
          </div>
        </div>

        {/* Work Experience */}
        <div className="mt-4">
          <label className="block font-medium">Work Experience</label>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setExperience("Experienced")}
              className={`${buttonClasses} ${
                experience === "Experienced" ? "bg-blue-500 text-white" : ""
              }`}
            >
              I have experience
            </button>
            <button
              type="button"
              onClick={() => setExperience("Fresher")}
              className={`${buttonClasses} ${
                experience === "Fresher" ? "bg-blue-500 text-white" : ""
              }`}
            >
              I am a fresher
            </button>
          </div>
        </div>

        {/* City */}
        <div className="mt-4">
          <label className="block font-medium">Which city do you want to work in?</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </div>

        {/* Next Button */}
        <div className="mt-6 text-right">
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg text-white ${
              fullName ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!fullName}
          >
            Next &gt;&gt;&gt;
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmpProfile;
