import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Mail, Download, FileText } from "lucide-react";
import Sidebar from "../cvdetails/layout/Sidebar.jsx";
import Header from "../navbar/Header";
import { fetchCandidateDashboard } from "../../store/dashboardSlice.js";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((s) => s.user);
  const { profile, profileCompletion, notifications, jobs, isLoading, error } =
    useSelector((s) => s.dashboard);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "job_seeker") {
      navigate(`/login?username=${userInfo?.username || "user"}`, {
        replace: true,
      });
    }
    if (!userInfo?.name) {
      console.warn("userInfo.name is missing, fallback to 'User'");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "job_seeker") return;
    dispatch(fetchCandidateDashboard());
  }, [dispatch, userInfo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <Header />
        <div className="p-8 text-center text-gray-600" aria-live="polite">
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <Header />
        <div className="p-8">
          <div
            className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-lg"
            role="alert"
          >
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
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

      <Header />

      <div className="relative z-10 flex flex-col lg:flex-row">
        <Sidebar className="w-full lg:w-64" />

        <main className="flex-1 p-4 sm:p-6">
          <h4
            className="text-3xl font-bold text-gray-900 mb-4"
            role="heading"
            aria-label={`Welcome ${userInfo?.name || "User"} to your dashboard`}
          >
            Welcome{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              {userInfo?.name || "User"}
            </span>
            !
          </h4>
          <p className="text-base text-gray-600 mb-6">
            Ready to jump back in?
          </p>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
            <h5 className="text-lg font-semibold text-gray-800 mb-2">
              Profile Completion
            </h5>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="h-2.5 rounded-full bg-blue-600"
                style={{ width: `${profileCompletion || 0}%` }}
                aria-label={`Profile completion ${profileCompletion || 0}%`}
              ></div>
            </div>
            <p className="text-base text-gray-600">
              Your profile is {profileCompletion || 0}% complete.{" "}
              <Link
                to="/cadprofile"
                className="text-blue-600 hover:text-purple-500 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                aria-label="Complete your profile"
              >
                Complete your profile
              </Link>{" "}
              to improve visibility!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Link
              to="/applied"
              className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              aria-label="View applied jobs"
            >
              <div className="text-gray-500">Applied Jobs</div>
              <div className="text-2xl font-bold text-gray-800">
                {profile?.appliedCount ?? 0}
              </div>
            </Link>
            <Link
              to="/shortlisted-jobs"
              className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              aria-label="View shortlisted jobs"
            >
              <div className="text-gray-500">Shortlisted</div>
              <div className="text-2xl font-bold text-blue-600">
                {profile?.shortlistedCount ?? 0}
              </div>
            </Link>
            <Link
              to="/recruiter-actions"
              className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              aria-label="View recruiter actions"
            >
              <div className="text-gray-500">Recruiter Actions</div>
              <div className="text-2xl font-bold text-purple-500">
                {profile?.recruiterActionsCount ?? 0}
              </div>
            </Link>
            <Link
              to="/cadmessages"
              className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in"
              aria-label="View messages"
            >
              <div className="text-gray-500">Messages</div>
              <div className="text-2xl font-bold text-blue-600">
                {profile?.messageCount ?? 0}
              </div>
            </Link>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-800">
                Your Profile Views
              </h5>
              <select
                className="p-2 border border-gray-300 rounded text-base text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Select profile views timeframe"
              >
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="flex justify-center">
              <div className="w-full h-48">
                <div
                  className="bg-gray-200 h-full rounded flex items-center justify-center text-gray-500"
                  aria-label="Profile views chart (data for selected timeframe)"
                >
                  Chart Placeholder (Profile Views)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
            <h5 className="text-lg font-semibold text-gray-800 mb-4">
              Notifications
            </h5>
            <ul className="space-y-4" aria-live="polite">
              {notifications.map((n) => (
                <li
                  key={n.id || n._id}
                  className="flex items-center text-gray-700"
                  role="alert"
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
              to="/job-alerts"
              className="mt-4 inline-block text-blue-600 hover:text-purple-500 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
              aria-label="View all notifications"
            >
              View All Notifications{" "}
              <ChevronRight size={16} className="inline" />
            </Link>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-sm animate-fade-in">
            <h5 className="text-lg font-semibold text-gray-800 mb-4">
              Jobs Applied Recently
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id || job._id}
                  className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-6 animate-fade-in"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={job.logo || "/logos/default.png"}
                      alt={job.company}
                      className="w-12 h-12 rounded"
                      aria-label={`${job.company} logo`}
                    />
                    <div className="ml-4 flex-1">
                      <h6 className="font-semibold text-gray-800">{job.title}</h6>
                      <div className="flex items-center text-base text-gray-500 space-x-3 mt-1">
                        <span>{job.company}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.time}</span>
                      </div>
                      <div className="flex items-center text-base text-gray-500 mt-1">
                        💰 {job.salary}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {(job.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs rounded-full bg-pink-500/20 text-purple-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-gray-600">
                    <span className="font-medium">Status: </span>
                    {job.status || "Applied"}
                  </div>
                  <div className="text-base text-gray-600 mt-1">
                    <span className="font-medium">Recruiter Actions: </span>
                    {job.recruiterActions?.invitationSent && (
                      <span className="text-blue-600">Invitation Sent </span>
                    )}
                    {job.recruiterActions?.resumeDownloaded && (
                      <span className="text-purple-500">Resume Downloaded</span>
                    )}
                    {!job.recruiterActions?.invitationSent &&
                      !job.recruiterActions?.resumeDownloaded && (
                        <span>No actions yet</span>
                      )}
                  </div>
                  <Link
                    to={`/job/${job.id || job._id}`}
                    className="mt-2 text-blue-600 hover:text-purple-500 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                    aria-label={`View details for ${job.title}`}
                  >
                    View Details <ChevronRight size={16} className="inline" />
                  </Link>
                </div>
              ))}
            </div>
            <Link
              to="/applied"
              className="mt-4 inline-block text-blue-600 hover:text-purple-500 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
              aria-label="View all applied jobs"
            >
              View All Applied Jobs <ChevronRight size={16} className="inline" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;