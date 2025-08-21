import { Link } from "react-router-dom";
import { User, Briefcase } from "lucide-react";

const UserType = () => {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Welcome to IHire</h2>
      <p className="text-sm text-gray-500 mb-6">
        Please select your role to continue
      </p>

      <div className="flex flex-col gap-4">
        <Link
          to="/login?type=candidate"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
        >
          <User size={18} /> I'm a Candidate
        </Link>

        <Link
          to="/login?type=employee"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
        >
          <Briefcase size={18} /> I'm an Employee
        </Link>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Sign up here
        </Link>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>Candidate</strong>: Job seekers looking for opportunities.
        </p>
        <p>
          <strong>Employee</strong>: Employers or recruiters posting jobs.
        </p>
      </div>
    </div>
  );
};

export default UserType;
