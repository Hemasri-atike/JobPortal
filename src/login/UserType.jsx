
import React from 'react';
import { Link } from 'react-router-dom';

const UserType = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Welcome to the Job Portal</h2>
        <p className="text-sm text-gray-500 mb-8">
          Please select your role to continue
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login?type=candidate"
            className="w-full sm:w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            I'm a Candidate
          </Link>
          <Link
            to="/login?type=employee"
            className="w-full sm:w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            I'm an Employee
          </Link>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Not sure which role to choose?{' '}
            <span className="text-gray-500">
              Candidates are job seekers looking for opportunities. Employees are employers or recruiters posting jobs.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserType;