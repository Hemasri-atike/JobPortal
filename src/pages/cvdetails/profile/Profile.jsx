import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { User, Edit, GraduationCap, Briefcase, MapPin, FileText } from "lucide-react";
import Sidebar from "../layout/Sidebar.jsx";
import Header from "../../navbar/Header.jsx";
import { fetchProfile, clearMessages as clearProfileMessages } from "../../../store/profileSlice.js";
import { loadCandidate, clearCandidateMessages } from "../../../store/candidateSlice.js";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, error: profileError, success: profileSuccess } = useSelector((state) => state.profile);
  const { data: candidate, loading: candidateLoading, error: candidateError, success: candidateSuccess } = useSelector((state) => state.candidate);
  const { userInfo } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect to login if not authenticated or not a job_seeker
  useEffect(() => {
    if (!userInfo || userInfo?.role !== "job_seeker") {
      navigate("/login?type=candidate", { replace: true });
    }
  }, [userInfo, navigate]);

  // Fetch profile and candidate data
  useEffect(() => {
    if (userInfo?.role === "job_seeker" && userInfo?.id) {
      dispatch(fetchProfile());
      dispatch(loadCandidate(userInfo.id));
    }
    return () => {
      dispatch(clearProfileMessages());
      dispatch(clearCandidateMessages());
    };
  }, [dispatch, userInfo]);

  // Combined states
  const isLoading = profileLoading || candidateLoading;
  const error = profileError || candidateError;
  const success = profileSuccess || candidateSuccess;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="ml-4 text-gray-600 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // // Error state
  // if (error) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
  //       <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
  //       <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
  //         <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-lg animate-slide-down">
  //           {error}
  //           <button
  //             onClick={() => {
  //               dispatch(clearProfileMessages());
  //               dispatch(clearCandidateMessages());
  //             }}
  //             className="ml-4 text-red-800 hover:text-red-900 font-medium focus:outline-none focus:underline"
  //             aria-label="Dismiss error"
  //           >
  //             Dismiss
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // No profile or candidate data
  if (!profile && !candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-600 text-yellow-800 p-4 rounded-lg animate-slide-down">
            No profile found. Please create your profile.
          </div>
          <Link
            to="/caddetails"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
            aria-label="Create your profile"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <div className="hidden lg:block w-72 text-white shadow-2xl">
          <Sidebar role="job_seeker" />
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          >
            <div
              className="absolute left-0 top-0 h-full w-72 bg-indigo-900 text-white z-50 transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar role="job_seeker" />
            </div>
          </div>
        )}
        <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-10 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {profile?.avatar && (
                  <img
                    src={profile.avatar}
                    alt={`${profile.name || "User"}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover shadow-sm mr-3"
                  />
                )}
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    {profile?.name || "Candidate Profile"}
                  </h1>
                  <p className="mt-3 text-gray-600 text-sm font-medium">
                    Your professional profile to attract employers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/caddetails")}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
                aria-label="Edit profile"
              >
                <Edit className="w-4 h-4 inline mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
          {success && (
            <div className="bg-green-50 border-l-4 border-green-600 text-green-800 p-4 rounded-lg mb-10 animate-slide-down">
              {success}
            </div>
          )}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-10 hover:shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center tracking-tight border-b border-gray-200 pb-2">
              <User className="w-5 h-5 text-indigo-600 mr-2" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Name:</strong>{" "}
                {profile?.name || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Email:</strong>{" "}
                {profile?.email || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Mobile:</strong>{" "}
                {profile?.mobile || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Address:</strong>{" "}
                {candidate?.address || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">LinkedIn:</strong>{" "}
                {candidate?.linkedin ? (
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    aria-label="View LinkedIn profile"
                  >
                    {candidate.linkedin}
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">GitHub:</strong>{" "}
                {candidate?.github ? (
                  <a
                    href={candidate.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    aria-label="View GitHub profile"
                  >
                    {candidate.github}
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
              <p className="text-sm text-gray-600 col-span-2">
                <strong className="font-medium text-gray-900">Objective:</strong>{" "}
                {candidate?.objective || "Not provided"}
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-10 hover:shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center tracking-tight border-b border-gray-200 pb-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 mr-2" />
              Education
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Graduation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Degree:</strong>{" "}
                    {candidate?.graduationDegree || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">University:</strong>{" "}
                    {candidate?.graduationUniversity || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">College:</strong>{" "}
                    {candidate?.graduationCollege || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Location:</strong>{" "}
                    {candidate?.graduationCity && candidate?.graduationState
                      ? `${candidate.graduationCity}, ${candidate.graduationState}`
                      : "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Year:</strong>{" "}
                    {candidate?.graduationYear || "Not provided"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Intermediate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Board:</strong>{" "}
                    {candidate?.interBoard || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Stream:</strong>{" "}
                    {candidate?.interStream || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">College:</strong>{" "}
                    {candidate?.interCollege || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Location:</strong>{" "}
                    {candidate?.interCity && candidate?.interState
                      ? `${candidate.interCity}, ${candidate.interState}`
                      : "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Year:</strong>{" "}
                    {candidate?.interYear || "Not provided"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">10th</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Board:</strong>{" "}
                    {candidate?.tenthBoard || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">School:</strong>{" "}
                    {candidate?.tenthSchool || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Location:</strong>{" "}
                    {candidate?.tenthCity && candidate?.tenthState
                      ? `${candidate.tenthCity}, ${candidate.tenthState}`
                      : "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="font-medium text-gray-900">Year:</strong>{" "}
                    {candidate?.tenthYear || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-10 hover:shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center tracking-tight border-b border-gray-200 pb-2">
              <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
              Work Experience
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Years of Experience:</strong>{" "}
                {candidate?.experience || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Company:</strong>{" "}
                {candidate?.companyName || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Job Title:</strong>{" "}
                {candidate?.jobTitle || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Duration:</strong>{" "}
                {candidate?.duration || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Responsibilities:</strong>{" "}
                {candidate?.responsibilities || "Not provided"}
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-10 hover:shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center tracking-tight border-b border-gray-200 pb-2">
              <MapPin className="w-5 h-5 text-indigo-600 mr-2" />
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Current Location:</strong>{" "}
                {candidate?.currentLocation || "Not provided"}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium text-gray-900">Preferred Location:</strong>{" "}
                {candidate?.preferredLocation || "Not provided"}
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center tracking-tight border-b border-gray-200 pb-2">
              <FileText className="w-5 h-5 text-indigo-600 mr-2" />
              Resume
            </h2>
            <p className="text-sm text-gray-600">
              {candidate?.resume ? (
                <a
                  href={candidate.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
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