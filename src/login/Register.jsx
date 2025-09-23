import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/userSlice.js";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, error: reduxError } = useSelector((state) => state.user);

  const queryParams = new URLSearchParams(location.search);
  const userType = ["candidate", "employer"].includes(queryParams.get("type"))
    ? queryParams.get("type")
    : "candidate";
  const role = userType === "candidate" ? "job_seeker" : "employer";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    company_name: "",
    role,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.name || !formData.email || !formData.password) {
      setLocalError("Name, email, and password are required");
      return;
    }

    if (formData.password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setLocalError("Mobile number must be 10 digits");
      return;
    }

    if (userType === "employer" && !formData.company_name) {
      setLocalError("Company name is required");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      mobile: formData.mobile,
      ...(userType === "employer" && { company_name: formData.company_name }),
    };

    const resultAction = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(resultAction)) {
      navigate(userType === "candidate" ? "/cadprofile" : "cmpprofile");
    } else {
      setLocalError(resultAction.payload || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {userType === "employer" ? "Employer" : "Candidate"}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Registration
            </span>
          </h2>
          <p className="text-base text-gray-600">
            {userType === "employer"
              ? "Create your company account"
              : "Join thousands of job seekers"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            aria-label="Full name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            aria-label="Email address"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            aria-label="Password"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            aria-label="Confirm password"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleInputChange}
            className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            aria-label="Mobile number"
          />

          {userType === "employer" && (
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              aria-label="Company name"
            />
          )}

          {(localError || reduxError) && (
            <div
              className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-lg"
              role="alert"
            >
              {localError || reduxError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              userType === "employer"
                ? "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
            } text-white px-6 py-3 rounded-lg disabled:bg-gray-400 focus:outline-none focus:ring-2 transition-colors font-semibold`}
            aria-label={userType === "employer" ? "Register as employer" : "Register as candidate"}
          >
            {isLoading ? "Registering..." : "Register Now"}
          </button>

          <div className="text-center mt-4 text-sm text-gray-600">
            <Link
              to={`/register?type=${userType === "employer" ? "candidate" : "employer"}`}
              className="text-blue-600 hover:text-purple-500 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
              aria-label={
                userType === "employer"
                  ? "Register as a candidate"
                  : "Register as an employer"
              }
            >
              {userType === "employer"
                ? "Looking for a job? Register as a candidate"
                : "Are you an employer? Register as an employer"}
            </Link>
          </div>
        </form>
      </div>

      {/* Tailwind Animation Classes */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default Register;