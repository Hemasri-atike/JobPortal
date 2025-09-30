import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react"; // Import Lucide icons
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
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`); // Debug log
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError("Please enter a valid email address");
      return;
    }

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
      navigate(userType === "candidate" ? "/caddetails" : "/cmpprofile");
    } else {
      setLocalError(resultAction.payload || "Registration failed");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8">
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8 animate-fade-in">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            {userType === "employer" ? "Employer" : "Candidate"}{" "}
            <span className="text-[#4A628A]">Registration</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            {userType === "employer"
              ? "Create your company account to hire top talent"
              : "Join thousands of job seekers today"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3 sm:space-y-4"
          autoComplete="off"
        >
          <div>
            <label
              htmlFor="name"
              className="text-xs sm:text-sm font-semibold text-gray-500 block"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              aria-label="Full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-xs sm:text-sm font-semibold text-gray-500 block"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              autoComplete="off"
              aria-label="Email address"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="text-xs sm:text-sm font-semibold text-gray-500 block"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              autoComplete="new-password"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[68%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="text-xs sm:text-sm font-semibold text-gray-500 block"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              autoComplete="new-password"
              aria-label="Confirm password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-[68%] transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="text-xs sm:text-sm font-semibold text-gray-500 block"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              placeholder="Enter 10-digit mobile number"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              autoComplete="tel"
              aria-label="Mobile number"
            />
          </div>

          {userType === "employer" && (
            <div>
              <label
                htmlFor="company_name"
                className="text-xs sm:text-sm font-semibold text-gray-500 block"
              >
                Company Name
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                placeholder="Enter company name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                aria-label="Company name"
              />
            </div>
          )}

          {(localError || reduxError) && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-lg text-xs sm:text-sm"
              role="alert"
            >
              {localError || reduxError}
            </div>
          )}

          <div className="mt-4 sm:mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#4A628A] to-[#4A628A] text-white py-2 sm:py-3 rounded-lg hover:from-[#89b4d4] hover:to-[#89b4d4] focus:ring-2 focus:ring-[#89b4d4] focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-sm sm:text-base"
              aria-label={
                userType === "employer"
                  ? "Register as employer"
                  : "Register as candidate"
              }
            >
              {isLoading ? "Registering..." : "Register Now"}
            </button>
          </div>
          <div className="flex justify-between">
            <div className="text-left text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
              <Link
                to={`/register?type=${
                  userType === "employer" ? "candidate" : "employer"
                }`}
                className="text-[#4A628A] underline hover:text-[#4A628A] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label={
                  userType === "employer"
                    ? "Register as a candidate"
                    : "Register as an employer"
                }
              >
                {userType === "employer"
                  ? "Looking for a job? Register as a candidate"
                  : "Hiring? Register as an employer"}
              </Link>
            </div>

            <button
              onClick={handleCancel}
              className="w-full max-w-max bg-gray-200 text-gray-600 p-2 sm:px-4 rounded-lg hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all font-semibold text-sm sm:text-base flex items-center justify-center"
              aria-label="Cancel registration"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Register;