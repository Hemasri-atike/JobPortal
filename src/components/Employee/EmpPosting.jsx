import React from 'react';
import { Link } from 'react-router-dom';

const EmpPosting = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Post a Job</h2>

        <form className="space-y-6">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Frontend Developer"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-gray-700 font-medium mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="e.g. Google"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g. Hyderabad, India"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Number of Vacancies */}
          <div>
            <label htmlFor="vacancies" className="block text-gray-700 font-medium mb-1">
              Number of Vacancies
            </label>
            <input
              type="number"
              id="vacancies"
              name="vacancies"
              placeholder="e.g. 5"
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Job Type & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="jobType" className="block text-gray-700 font-medium mb-1">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select job type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label htmlFor="experienceLevel" className="block text-gray-700 font-medium mb-1">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select experience level</option>
                <option value="Fresher">Fresher</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="minSalary" className="block text-gray-700 font-medium mb-1">
                Minimum Salary (per month)
              </label>
              <input
                type="number"
                id="minSalary"
                name="minSalary"
                placeholder="e.g. 30000"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="maxSalary" className="block text-gray-700 font-medium mb-1">
                Maximum Salary (per month)
              </label>
              <input
                type="number"
                id="maxSalary"
                name="maxSalary"
                placeholder="e.g. 80000"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label htmlFor="skills" className="block text-gray-700 font-medium mb-1">
              Required Skills
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              placeholder="e.g. React, Node.js, MySQL"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter detailed job description..."
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
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

          {/* Navigation Links for Consistency with Register/Login */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Back to{' '}
              <Link to="/jobs" className="text-blue-600 hover:underline font-medium">
                Job Listings
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpPosting;