import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/userSlice";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useSelector((state) => state.user);

  const queryParams = new URLSearchParams(location.search);
  const loginType = ["candidate", "employee"].includes(queryParams.get("type"))
    ? queryParams.get("type")
    : "candidate";

  const from =
    location.state?.from?.pathname ||
    (loginType === "employee" ? "/empdashboard" : "/cadprofile");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    dispatch(loginUser({ mobile, password }))
      .unwrap()
      .then((user) => {
        // ✅ user is already returned by the thunk
        navigate(from, { replace: true });
      })
      .catch(() => {});
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
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile Number"
            className="w-full border rounded-lg px-3 py-2"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <Link
              to={`/register?type=${loginType}`}
              className="text-blue-600 hover:underline"
            >
              Don’t have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
