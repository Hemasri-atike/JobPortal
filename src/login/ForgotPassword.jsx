import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Step 1: Verify mobile exists
  const handleVerifyMobile = async (e) => {
    e.preventDefault();
    if (!mobile) {
      toast.error("Please enter your mobile number");
      return;
    }

    try {
      // Call the backend to check if mobile exists
      const response = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        {
          mobile,
        }
      );

      // Backend will respond with 400 if newPassword missing, so we handle it
      if (
        response.data.error ===
          "New password cannot be the same as the current password" ||
        response.data.success
      ) {
        // This means mobile exists
        toast.success("Mobile verified. Please set a new password.");
        setStep(2);
      } else {
        toast.error(response.data.error || "Mobile number not found");
      }
    } catch (error) {
      // If 400 because newPassword missing, treat it as mobile exists
      if (
        error.response?.status === 400 &&
        error.response?.data?.error.includes("new password")
      ) {
        toast.success("Mobile verified. Please set a new password.");
        setStep(2);
      } else if (error.response?.status === 404) {
        toast.error("Mobile number not found");
      } else {
        console.error(error);
        toast.error("Something went wrong. Try again.");
      }
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter the new password twice");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        {
          mobile,
          newPassword,
        }
      );

      if (response.data.success) {
        toast.success("Password updated successfully. Please log in.");

        if (response.data.role === "employer") {
          navigate("/login?type=employer");
        } else {
          navigate("/login");
        }
      } else {
        toast.error(response.data.error || "Failed to update password.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleVerifyMobile} className="space-y-4">
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your registered mobile number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Verify Mobile
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ForgotPassword;
