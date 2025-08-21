import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/userSlice.js";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  const queryParams = new URLSearchParams(location.search);
  const userType = ["candidate", "employee"].includes(queryParams.get("type"))
    ? queryParams.get("type")
    : "candidate";
  const role = userType === "candidate" ? "job_seeker" : "employer";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    company_name: "",
    position: "",
    role,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  // Handle inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Client validations
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
    if (userType === "candidate" && !/^\d{10}$/.test(formData.mobile)) {
      setLocalError("Mobile number must be 10 digits");
      return;
    }
    if (userType === "employee" && (!formData.company_name || !formData.position)) {
      setLocalError("Company name and position are required");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      mobile: userType === "candidate" ? formData.mobile : null,
      company_name: userType === "employee" ? formData.company_name : null,
      position: userType === "employee" ? formData.position : null,
    };

    const resultAction = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(resultAction)) {
      navigate(userType === "candidate" ? "/cadprofile" : "/empprofile");
    } else {
      setLocalError(resultAction.payload);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            {userType === "employee" ? "Employer Registration" : "Candidate Registration"}
          </h2>
          <p className="text-sm text-gray-500">
            {userType === "employee"
              ? "Create your company account to post jobs"
              : "Join thousands of job seekers"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Candidate mobile */}
          {userType === "candidate" && (
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          {/* Employer company + position */}
          {userType === "employee" && (
            <>
              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="position"
                placeholder="Your Position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </>
          )}

          {/* Error */}
          {localError && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-lg">
              {localError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {isLoading ? "Registering..." : "Register Now"}
          </button>

          <div className="text-center mt-4">
            <Link
              to={
                userType === "employee"
                  ? "/register?type=candidate"
                  : "/register?type=employee"
              }
              className="text-sm text-gray-600 hover:underline"
            >
              {userType === "employee"
                ? "Looking for a job? Register as a candidate"
                : "Are you an employer? Register as an employer"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
