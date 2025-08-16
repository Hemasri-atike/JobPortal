import React from "react";

const Application = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application Submitted!");
  };

  return (
    <div className="min-h-screen bg-[#f0ebf8] flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        {/* Form Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Job Application Form
        </h1>
        <p className="text-gray-600 mb-6">
          Please fill out the required fields (*)
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Full Name *
            </label>
            <input
              type="text"
              required
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Email *
            </label>
            <input
              type="email"
              required
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Location / City
            </label>
            <input
              type="text"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          {/* Professional Info */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Years of Experience
            </label>
            <input
              type="number"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Current Job Title
            </label>
            <input
              type="text"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Current Company
            </label>
            <input
              type="text"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Qualification
            </label>
            <select className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2">
              <option value="">Select</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Specialization
            </label>
            <input
              type="text"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              University / College
            </label>
            <input
              type="text"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Skills (comma separated)
            </label>
            <input
              type="text"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Upload Resume *
            </label>
            <input type="file" required className="w-full" />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Cover Letter
            </label>
            <textarea
              rows="3"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            ></textarea>
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-800">
              LinkedIn Profile
            </label>
            <input
              type="url"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Portfolio / GitHub Link
            </label>
            <input
              type="url"
              className="w-full border-b border-gray-300 focus:border-purple-600 focus:outline-none py-2"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-purple-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Application;
