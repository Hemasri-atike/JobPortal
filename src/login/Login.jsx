import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import IHireBoy from "../../public/assets/LoginBG.png";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.user);

  const queryParams = new URLSearchParams(location.search);
  const loginType = ["candidate", "employer"].includes(queryParams.get("type"))
    ? queryParams.get("type")
    : "candidate";

  const from =
    location.state?.from?.pathname ||
    (loginType === "employer" ? "/empdashboard" : "/caddetails");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      setMobileError("Enter a valid 10-digit mobile number");
      return;
    }
    setMobileError("");

    try {
      await dispatch(loginUser({ mobile, password, loginType })).unwrap();
      navigate(from, { replace: true });
      toast.success(`Logged in as ${loginType}`);
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err?.message || "Login failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl flex flex-col-reverse sm:flex-row rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side: Login Form */}
        <div className="w-full sm:w-1/2 p-6 sm:p-8 bg-white flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {loginType === "employer" ? "Employer" : "Candidate"}{" "}
              <span className="bg-gradient-to-r from-[#4A628A] to-[#4A628A] text-transparent bg-clip-text">
                Login
              </span>
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {loginType === "employer"
                ? "Access your hiring dashboard."
                : "Unlock new career opportunities."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-semibold text-gray-500"
                >
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                  aria-label="Mobile number"
                  autoComplete="off"
                />
                {mobileError && (
                  <p className="mt-1 text-xs text-red-500" role="alert">
                    {mobileError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-500"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                    aria-label="Password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 top-1/2 right-2 -translate-y-1/2 -translate-x-1/2 flex items-end text-gray-600 hover:text-gray-800 focus:outline-none z-10"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  loginType === "employer"
                    ? "bg-purple-600 hover:bg-[#4A628A] focus:bg-[#4A628A]"
                    : "bg-[#4A628A] hover:bg-[#4A628A] focus:bg-[#4A628A]"
                } text-white py-2.5 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                aria-label={
                  loginType === "employer"
                    ? "Sign in as employer"
                    : "Sign in as candidate"
                }
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-center text-sm space-y-2 sm:space-y-0">
                <Link
                  to={`/register?type=${loginType}`}
                  className="text-black hover:text-[#4A628A] font-medium transition-colors"
                  aria-label="Sign up for an account"
                >
                  Don’t have an account? Sign up
                </Link>
                <Link
                  to="/forgot-password"
                  className="text-black hover:text-[#4A628A] font-medium transition-colors"
                  aria-label="Forgot your password?"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Background Image with Overlay */}
        <div className="w-full sm:w-1/2 bg-white">
          <div
            className="w-full h-64 sm:h-full bg-no-repeat bg-cover bg-center relative"
            style={{ backgroundImage: `url(${IHireBoy})` }}
          >
            <div className="absolute top-4 sm:top-8 flex items-start justify-center w-full">
              <div className="text-center text-white p-4 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">
                  {loginType === "employer"
                    ? "Hire Top Talent Today"
                    : "Find Your Dream Job"}
                </h3>
                <p className="text-xs sm:text-sm opacity-90">
                  {loginType === "employer"
                    ? "Post jobs, manage candidates, and build your dream team with ease."
                    : "Explore opportunities, connect with employers, and take the next step in your career."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default Login;