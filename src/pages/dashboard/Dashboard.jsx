import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Mail, Download, FileText } from "lucide-react";
import Sidebar from "../cvdetails/layout/Sidebar.jsx";
import Header from "../navbar/Header";
import {
  fetchCandidateDashboard,
  fetchEmployerDashboard,

} from "../../store/dashboardSlice.js";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, userType } = useSelector((s) => s.user);
  const {
    profile,
    profileCompletion,
    notifications,
    jobs,
    stats,
    isLoading,
    error,
    deleteMessage,
  } = useSelector((s) => s.dashboard);

  // Kick to login if not authenticated
  useEffect(() => {
    if (!userInfo) {
      navigate("/login?type=candidate", { replace: true });
    }
  }, [userInfo, navigate]);

  // Fetch dashboard by role
  useEffect(() => {
    if (!userInfo) return;
    if (userType === "employee" || userType === "employer") {
      dispatch(fetchEmployerDashboard());
    } else if (userType === "candidate") {
      dispatch(fetchCandidateDashboard());
    }
  }, [dispatch, userInfo, userType]);

  // Handle delete users action
  const handleDeleteUsers = () => {
    if (window.confirm("Are you sure you want to delete 10 users? This cannot be undone.")) {
      dispatch(deleteTenUsers());
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-8 text-center text-gray-600">Loading dashboard…</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-8">
          <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const isCandidate = userType === "candidate";
  const isAdmin = userType === "admin";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar and Dashboard Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar className="w-full lg:w-64" />

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6">
          <h4 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome {profile?.name || userInfo?.name || "User"}!
          </h4>
          <p className="text-gray-600 mb-6">
            {isCandidate
              ? "Ready to jump back in?"
              : isAdmin
              ? "Manage your platform!"
              : "Manage your job postings and applications!"}
          </p>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h5 className="text-lg font-semibold text-gray-800 mb-2">
                Admin Controls
              </h5>
              <button
                onClick={handleDeleteUsers}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete 10 Oldest Users
              </button>
              {deleteMessage && (
                <p className="mt-2 text-green-600">{deleteMessage}</p>
              )}
            </div>
          )}

          {/* Candidate Dashboard */}
          {isCandidate ? (
            <>
              {/* Profile Completion Meter */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Profile Completion
                </h5>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${profileCompletion || 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Your profile is {profileCompletion || 0}% complete.{" "}
                  <Link
                    to="/cadprofile"
                    className="text-blue-600 hover:underline"
                  >
                    Complete your profile
                  </Link>{" "}
                  to improve visibility!
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Link
                  to="/applied"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="text-gray-500">Applied Jobs</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {profile?.appliedCount ?? 0}
                  </div>
                </Link>
                <Link
                  to="/shortlisted-jobs"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="text-gray-500">Shortlisted</div>
                  <div className="text-2xl font-bold text-green-500">
                    {profile?.shortlistedCount ?? 0}
                  </div>
                </Link>
                <Link
                  to="/recruiter-actions"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="text-gray-500">Recruiter Actions</div>
                  <div className="text-2xl font-bold text-yellow-500">
                    {profile?.recruiterActionsCount ?? 0}
                  </div>
                </Link>
                <Link
                  to="/cadmessages"
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="text-gray-500">Messages</div>
                  <div className="text-2xl font-bold text-blue-500">
                    {profile?.messageCount ?? 0}
                  </div>
                </Link>
              </div>

              {/* Profile Views Chart Placeholder */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold text-gray-800">
                    Your Profile Views
                  </h5>
                  <select className="p-2 border rounded text-sm text-gray-600">
                    <option>Last 30 Days</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div className="flex justify-center">
                  <div className="w-full h-48">
                    <div className="bg-gray-200 h-full rounded flex items-center justify-center text-gray-500">
                      Chart Placeholder (Profile Views)
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">
                  Notifications
                </h5>
                <ul className="space-y-4" aria-live="polite">
                  {notifications.map((n) => (
                    <li
                      key={n.id || n._id}
                      className={`flex items-center ${n.color || "text-gray-700"}`}
                    >
                      <span className="mr-2">
                        {n.type === "invitation" && <Mail size={16} />}
                        {n.type === "download" && <Download size={16} />}
                        {n.type === "shortlist" && <FileText size={16} />}
                        {n.type === "application" && <FileText size={16} />}
                      </span>
                      {n.message}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/notifications"
                  className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                >
                  View All Notifications{" "}
                  <ChevronRight size={16} className="inline" />
                </Link>
              </div>

              {/* Jobs Applied Recently */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">
                  Jobs Applied Recently
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <div
                      key={job.id || job._id}
                      className="bg-white rounded-lg shadow p-5 flex flex-col"
                    >
                      <div className="flex items-center mb-4">
                        <img
                          src={job.logo || "/logos/default.png"}
                          alt={job.company}
                          className="w-12 h-12 rounded"
                        />
                        <div className="ml-4 flex-1">
                          <h6 className="font-semibold text-gray-800">
                            {job.title}
                          </h6>
                          <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                            <span>{job.company}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            💰 {job.salary}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {(job.tags || []).map((tag) => (
                              <span
                                key={tag}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  tag === "Full Time"
                                    ? "bg-blue-100 text-blue-600"
                                    : tag === "Freelancer"
                                    ? "bg-purple-100 text-purple-600"
                                    : tag === "Part Time"
                                    ? "bg-indigo-100 text-indigo-600"
                                    : tag === "Temporary"
                                    ? "bg-pink-100 text-pink-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Status: </span>
                        {job.status || "Applied"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Recruiter Actions: </span>
                        {job.recruiterActions?.invitationSent && (
                          <span className="text-green-600">Invitation Sent </span>
                        )}
                        {job.recruiterActions?.resumeDownloaded && (
                          <span className="text-yellow-600">
                            Resume Downloaded
                          </span>
                        )}
                        {!job.recruiterActions?.invitationSent &&
                          !job.recruiterActions?.resumeDownloaded && (
                            <span>No actions yet</span>
                          )}
                      </div>
                      <Link
                        to={`/job/${job.id || job._id}`}
                        className="mt-2 text-blue-600 hover:underline text-sm"
                      >
                        View Details <ChevronRight size={16} className="inline" />
                      </Link>
                    </div>
                  ))}
                </div>
                <Link
                  to="/applied-jobs"
                  className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                >
                  View All Applied Jobs{" "}
                  <ChevronRight size={16} className="inline" />
                </Link>
              </div>
            </>
          ) : (
            /* Employer Dashboard */
            <>
              {/* Company Stats */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Company Stats
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Active Job Postings</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {jobs.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats?.totalApplications ??
                        jobs.reduce((sum, j) => sum + (j.applications || 0), 0)}
                    </p>
                  </div>
                </div>
                <Link
                  to="/post-job"
                  className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                >
                  Post a New Job <ChevronRight size={16} className="inline" />
                </Link>
              </div>

              {/* Notifications */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">
                  Notifications
                </h5>
                <ul className="space-y-4" aria-live="polite">
                  {notifications.map((n) => (
                    <li
                      key={n.id || n._id}
                      className={`flex items-center ${n.color || "text-gray-700"}`}
                    >
                      <span className="mr-2">
                        {n.type === "invitation" && <Mail size={16} />}
                        {n.type === "download" && <Download size={16} />}
                        {n.type === "application" && <FileText size={16} />}
                      </span>
                      {n.message}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/notifications"
                  className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                >
                  View All Notifications{" "}
                  <ChevronRight size={16} className="inline" />
                </Link>
              </div>

              {/* Active Job Postings */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">
                  Active Job Postings
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <div
                      key={job.id || job._id}
                      className="bg-white rounded-lg shadow p-5 flex flex-col"
                    >
                      <div className="flex items-center mb-4">
                        <img
                          src={job.logo || "/logos/default.png"}
                          alt={job.company}
                          className="w-12 h-12 rounded"
                        />
                        <div className="ml-4 flex-1">
                          <h6 className="font-semibold text-gray-800">
                            {job.title}
                          </h6>
                          <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                            <span>{job.company}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            💰 {job.salary}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {(job.tags || []).map((tag) => (
                              <span
                                key={tag}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  tag === "Full Time"
                                    ? "bg-blue-100 text-blue-600"
                                    : tag === "Open"
                                    ? "bg-green-100 text-green-600"
                                    : tag === "Hiring"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : ""
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Applications: </span>
                        {job.applications || 0}
                      </div>
                      <Link
                        to={`/job/${job.id || job._id}/manage`}
                        className="mt-2 text-blue-600 hover:underline text-sm"
                      >
                        Manage Applications{" "}
                        <ChevronRight size={16} className="inline" />
                      </Link>
                    </div>
                  ))}
                </div>
                <Link
                  to="/manage-jobs"
                  className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                >
                  View All Jobs <ChevronRight size={16} className="inline" />
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;