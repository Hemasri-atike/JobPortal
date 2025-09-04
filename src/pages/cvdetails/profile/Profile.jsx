import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { User, Edit, GraduationCap, Briefcase, MapPin, FileText } from "lucide-react";
import Sidebar from "../layout/Sidebar.jsx";
import Header from "../../navbar/Header.jsx";
import { fetchProfile, clearMessages } from "../../../store/profileSlice.js";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading, error, success } = useSelector((state) => state.profile);
  const { userInfo } = useSelector((state) => state.user);

  // Redirect to login if not authenticated or not a job_seeker
  useEffect(() => {
    if (!userInfo || userInfo?.role !== "job_seeker") {
      navigate("/login?type=candidate", { replace: true });
    }
  }, [userInfo, navigate]);

  // Fetch profile data and cleanup
  useEffect(() => {
    if (userInfo?.role === "job_seeker") {
      dispatch(fetchProfile());
    }
    return () => dispatch(clearMessages());
  }, [dispatch, userInfo]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-gray-700 text-lg font-medium animate-pulse">
            Loading your profile…
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
            No profile found. Please create your profile.
          </div>
          <Link
            to="/caddetails"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            aria-label="Create your profile"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <Sidebar role="job_seeker" />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {profile.name || "Candidate Profile"}
                  </h1>
                  <p className="mt-1 text-gray-600 text-sm">
                    Your professional profile to attract employers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/caddetails")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Edit profile"
              >
                <Edit className="w-4 h-4 inline mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6">
              {success}
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Name:</strong>{" "}
                {profile.name || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Email:</strong>{" "}
                {profile.email || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Mobile:</strong>{" "}
                {profile.mobile || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Address:</strong>{" "}
                {profile.address || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">LinkedIn:</strong>{" "}
                {profile.linkedin ? (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    aria-label="View LinkedIn profile"
                  >
                    {profile.linkedin}
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">GitHub:</strong>{" "}
                {profile.github ? (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    aria-label="View GitHub profile"
                  >
                    {profile.github}
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
              <p className="text-sm text-gray-600 col-span-2">
                <strong className="font-medium text-gray-900">Objective:</strong>{" "}
                {profile.objective || "Not provided"}
              </p>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
              Education
            </h2>
            <div className="space-y-4">
              {/* Graduation */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Graduation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Degree:</strong>{" "}
                    {profile.graduationDegree || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">University:</strong>{" "}
                    {profile.graduationUniversity || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">College:</strong>{" "}
                    {profile.graduationCollege || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Location:</strong>{" "}
                    {profile.graduationCity && profile.graduationState
                      ? `${profile.graduationCity}, ${profile.graduationState}`
                      : "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Year:</strong>{" "}
                    {profile.graduationYear || "Not provided"}
                  </p>
                </div>
              </div>
              {/* Intermediate */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Intermediate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Board:</strong>{" "}
                    {profile.interBoard || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Stream:</strong>{" "}
                    {profile.interStream || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">College:</strong>{" "}
                    {profile.interCollege || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Location:</strong>{" "}
                    {profile.interCity && profile.interState
                      ? `${profile.interCity}, ${profile.interState}`
                      : "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Year:</strong>{" "}
                    {profile.interYear || "Not provided"}
                  </p>
                </div>
              </div>
              {/* 10th */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">10th</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Board:</strong>{" "}
                    {profile.tenthBoard || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">School:</strong>{" "}
                    {profile.tenthSchool || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Location:</strong>{" "}
                    {profile.tenthCity && profile.tenthState
                      ? `${profile.tenthCity}, ${profile.tenthState}`
                      : "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Year:</strong>{" "}
                    {profile.tenthYear || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
              Work Experience
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Years of Experience:</strong>{" "}
                {profile.experience || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Company:</strong>{" "}
                {profile.companyName || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Job Title:</strong>{" "}
                {profile.jobTitle || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Duration:</strong>{" "}
                {profile.duration || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Responsibilities:</strong>{" "}
                {profile.responsibilities || "Not provided"}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Current Location:</strong>{" "}
                {profile.currentLocation || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Preferred Location:</strong>{" "}
                {profile.preferredLocation || "Not provided"}
              </p>
            </div>
          </div>

          {/* Resume */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              Resume
            </h2>
            <p className="text-sm text-gray-600">
              {profile.resume ? (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  aria-label="View resume"
                >
                  View Resume
                </a>
              ) : (
                "No resume uploaded"
              )}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;