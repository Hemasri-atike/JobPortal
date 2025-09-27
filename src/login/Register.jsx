import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/userSlice.js";
import SignIn from "../../public/assets/SignIn.jpg";

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
      navigate(userType === "candidate" ? "/caddetails" : "cmpprofile");
    } else {
      setLocalError(resultAction.payload || "Registration failed");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <section className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl max-h-screen mx-auto my-10 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <button
        onClick={handleCancel}
        className="absolute top-8 right-8 bg-[#cfe0fa] p-2 rounded-xl text-black focus:outline-none transition-colors"
        aria-label="Cancel registration"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      <div className="flex items-center justify-center w-full max-w-4xl gap-6">
        {/* Form Section */}
        <div className="relative z-10 w-full max-w-sm rounded-xl p-6 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              {userType === "employer" ? "Employer" : "Candidate"}{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                Registration
              </span>
            </h2>
            <p className="text-sm text-gray-500">
              {userType === "employer"
                ? "Create your company account"
                : "Join thousands of job seekers"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                aria-label="Full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                aria-label="Email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                aria-label="Password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                aria-label="Confirm password"
              />
            </div>

            <div>
              <label htmlFor="mobile" className="text-sm font-medium text-gray-700 block mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                aria-label="Mobile number"
              />
            </div>

            {userType === "employer" && (
              <div>
                <label htmlFor="company_name" className="text-sm font-medium text-gray-700 block mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  placeholder="Company Name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                  aria-label="Company name"
                />
              </div>
            )}

            {(localError || reduxError) && (
              <div
                className="bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm"
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
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:ring-purple-500"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500"
              } text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 transition-all font-medium text-sm`}
              aria-label={
                userType === "employer"
                  ? "Register as employer"
                  : "Register as candidate"
              }
            >
              {isLoading ? "Registering..." : "Register Now"}
            </button>

            <div className="text-center mt-3 text-xs text-gray-500">
              <Link
                to={`/register?type=${
                  userType === "employer" ? "candidate" : "employer"
                }`}
                className="text-blue-500 hover:text-purple-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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

        {/* Image Section */}
        <div className="relative max-h-max animate-float z-10  w-full transition-transform hover:scale-102 p-4 rounded-xl ">
          <img src={SignIn} alt="Sign In" className="rounded-xl w-full h-full object-cover" />
        </div>
      </div>

      {/* Tailwind Animation Classes */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
};

export default Register;