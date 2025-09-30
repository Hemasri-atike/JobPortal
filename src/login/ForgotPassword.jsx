import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";

const ForgotPassword = () => {
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Step 1: Verify mobile exists
  const handleVerifyMobile = async (e) => {
    e.preventDefault();
    if (!mobile) {
      toast.error("Please enter your mobile number");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { mobile }
      );

      if (
        response.data.error ===
          "New password cannot be the same as the current password" ||
        response.data.success
      ) {
        toast.success("Mobile verified. Please set a new password.");
        setStep(2);
      } else {
        toast.error(response.data.error || "Mobile number not found");
      }
    } catch (error) {
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
        { mobile, newPassword }
      );

      if (response.data.success) {
        toast.success("Password updated successfully. Please log in.");
        navigate(response.data.role === "employer" ? "/login?type=employer" : "/login");
      } else {
        toast.error(response.data.error || "Failed to update password.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Reset Your Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleVerifyMobile} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  id="mobile"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 transition-colors"
                  required
                  aria-label="Mobile number"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4A628A] to-[#4A628A] text-white py-2 rounded-xl hover:from-[#4A628A] hover:to-[#4A628A] transition-colors font-semibold shadow-md"
            >
              Verify Mobile
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-12 py-2 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 text-gray-900 transition-colors"
                  required
                  aria-label="New password"
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-12 py-2 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 text-gray-900 transition-colors"
                  required
                  aria-label="Confirm new password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4A628A] to-[#4A628A] text-white py-2 rounded-xl hover:from-[#4A628A] hover:to-[#4A628A] transition-colors font-semibold shadow-md"
            >
              Reset Password
            </button>
          </form>
        )}

        <div className="mt-6 text-right">
          <a
            href="/login"
            className="text-semibold text-sm text-[#4A628A] hover:text-[#4A628A] transition-colors"
          >
            Back to Login
          </a>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ForgotPassword;