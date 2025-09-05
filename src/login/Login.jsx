import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [mobileError, setMobileError] = useState("");

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
    (loginType === "employer" ? "/empdashboard" : "/cadprofile");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      setMobileError("Enter a valid 10-digit mobile number");
      return;
    }
    setMobileError("");

    dispatch(loginUser({ mobile, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
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
            {loginType === "employer" ? "Employer" : "Candidate"}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Login
            </span>
          </h2>
          <p className="text-base text-gray-600">
            {loginType === "employer"
              ? "Access your company dashboard"
              : "Welcome back! Log in to find your dream job."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number"
              className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              aria-label="Mobile number"
            />
            {mobileError && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {mobileError}
              </p>
            )}
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            aria-label="Password"
          />

          {error && (
            <div
              className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-lg"
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
                ? "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
            } text-white px-6 py-3 rounded-lg disabled:bg-gray-400 focus:outline-none focus:ring-2 transition-colors font-semibold`}
            aria-label={loginType === "employer" ? "Sign in as employer" : "Sign in as candidate"}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to={`/register?type=${loginType}`}
              className="text-blue-600 hover:text-purple-500 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
              aria-label="Sign up for an account"
            >
              Sign up
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

export default Login;