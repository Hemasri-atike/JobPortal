import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, userType } = useSelector((state) => state.user);

  // extract type from query params
  const queryParams = new URLSearchParams(location.search);
  const loginType = ["candidate", "employee"].includes(queryParams.get("type"))
    ? queryParams.get("type")
    : "candidate";

  const from =
    location.state?.from?.pathname ||
    (loginType === "employee" ? "/empdashboard" : "/cadprofile");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password, userType: loginType }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {}); // error is already handled in Redux
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            {loginType === "employee" ? "Employer Login" : "Candidate Login"}
          </h2>
          <p className="text-sm text-gray-500">
            {loginType === "employee"
              ? "Access your company dashboard"
              : "Welcome back! Please log in to find your dream job."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="flex items-center justify-center my-4">
            <span className="border-t border-gray-300 w-full"></span>
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <span className="border-t border-gray-300 w-full"></span>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to={`/register?type=${loginType}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link
              to={
                loginType === "employee"
                  ? "/login?type=candidate"
                  : "/login?type=employee"
              }
              className="text-sm text-gray-600 hover:underline"
            >
              {loginType === "employee"
                ? "Looking for a job? Switch to candidate login"
                : "Are you an employer? Switch to employer login"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
