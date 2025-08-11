import React from "react";

const EmpPosting = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Post a Job</h2>

        <form className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Company Name</label>
            <input
              type="text"
              placeholder="e.g. Google"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Hyderabad, India"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Number of Vacancies */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Number of Vacancies</label>
            <input
              type="number"
              placeholder="e.g. 5"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Job Type & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Job Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Experience Level</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                <option>Fresher</option>
                <option>1-2 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Minimum Salary (per month)</label>
              <input
                type="number"
                placeholder="e.g. 30000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Maximum Salary (per month)</label>
              <input
                type="number"
                placeholder="e.g. 80000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Required Skills</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, MySQL"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Job Description</label>
            <textarea
              placeholder="Enter detailed job description..."
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpPosting;