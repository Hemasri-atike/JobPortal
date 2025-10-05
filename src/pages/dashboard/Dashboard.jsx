import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Mail, Download, FileText } from "lucide-react";
import Sidebar from "../cvdetails/layout/Sidebar.jsx";
import Header from "../navbar/Header";
import { fetchCandidateDashboard } from "../../store/dashboardSlice.js";   
import { useState } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <div className="min-h-screen bg-white">
        <Header />
        <div
          className="p-4 sm:p-6 text-center text-[#3b4f73]"
          aria-live="polite"
        >
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="p-4 sm:p-6">
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
    <div className="min-h-screen relative top-16 p-6">
      <Header />
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-[240px]">
          <div className="lg:w-72 hidden lg:block">
            <Sidebar role="job_seeker" />
          </div>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            >
              <div
                className="absolute left-0 top-0 h-full w-64 sm:w-72 bg-indigo-900 text-white z-50 transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar role="job_seeker" />
              </div>
            </div>
          )}
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-6 max-w-7xl top-25 bg-[#89b4d4]/10 rounded-md shadow-md mx-auto w-full">
            <div className="bg-gradient-to-r from-[#3b4f73] to-[#89b4d4] border-2 border-white p-6 rounded-2xl shadow-sm hover:shadow-md mb-6">
              <h4
                className="text-2xl sm:text-3xl font-bold text-white mb-2"
                role="heading"
                aria-label={`Welcome ${
                  userInfo?.name || "User"
                } to your dashboard`}
              >
                Welcome{" "}
                <span className="text-white">{userInfo?.name || "User"}</span>!
              </h4>
              <p className="text-base text-white/80">Ready to jump back in?</p>
            </div>

            {/* Profile Completion */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6 transition-all hover:shadow-md">
              <h5 className="text-lg font-semibold text-[#3b4f73] mb-2">
                Profile Completion
              </h5>
              <div className="w-full bg-[#89b4d4]/20 rounded-full h-2.5 mb-2">
                <div
                  className="h-2.5 rounded-full bg-[#3b4f73]"
                  style={{ width: `${profileCompletion || 0}%` }}
                  aria-label={`Profile completion ${profileCompletion || 0}%`}
                ></div>
              </div>
              <p className="text-base text-[#3b4f73]/80">
                Your profile is {profileCompletion || 0}% complete.{" "}
                <Link
                  to="/caddetails"
                  className="text-[#89b4d4] hover:text-[#3b4f73] font-semibold focus:outline-none focus:ring-2 focus:ring-[#89b4d4] transition-colors"
                  aria-label="Complete your profile"
                >
                  Complete your profile
                </Link>{" "}
                to improve visibility!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  to: "/applied",
                  label: "Applied Jobs",
                  count: profile?.appliedCount ?? 0,
                },
                {
                  to: "/shortlisted-jobs",
                  label: "Shortlisted",
                  count: profile?.shortlistedCount ?? 0,
                },
                {
                  to: "/recruiter-actions",
                  label: "Recruiter Actions",
                  count: profile?.recruiterActionsCount ?? 0,
                },
                {
                  to: "/cadmessages",
                  label: "Messages",
                  count: profile?.messageCount ?? 0,
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                  aria-label={`View ${item.label.toLowerCase()}`}
                >
                  <div className="text-[#3b4f73]/80">{item.label}</div>
                  <div className="text-2xl font-bold text-[#3b4f73]">
                    {item.count}
                  </div>
                </Link>
              ))}
            </div>

            
           

            {/* Notifications */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h5 className="text-lg font-semibold text-[#3b4f73] mb-4">
                Notifications
              </h5>
              <ul className="space-y-4" aria-live="polite">
                {notifications.map((n) => (
                  <li
                    key={n.id || n._id}
                    className="flex items-center text-[#3b4f73]"
                    role="alert"
                  >
                    <span className="mr-2 text-[#89b4d4]">
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
                className="mt-4 inline-block text-[#89b4d4] hover:text-[#3b4f73] font-semibold focus:outline-none focus:ring-2 focus:ring-[#89b4d4] transition-colors"
                aria-label="View all notifications"
              >
                View All Notifications{" "}
                <ChevronRight size={16} className="inline" />
              </Link>
            </div>

            {/* Jobs Applied Recently */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h5 className="text-lg font-semibold text-[#3b4f73] mb-4">
                Jobs Applied Recently
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job.id || job._id}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={job.logo || "/logos/default.png"}
                        alt={job.company}
                        className="w-12 h-12 rounded"
                        aria-label={`${job.company} logo`}
                      />
                      <div className="ml-4 flex-1">
                        <h6 className="font-semibold text-[#3b4f73]">
                          {job.title}
                        </h6>
                        <div className="flex items-center text-sm text-[#3b4f73]/80 space-x-3 mt-1">
                          <span>{job.company}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-[#3b4f73]/80 mt-1">
                          💰 {job.salary}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {(job.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs rounded-full bg-[#89b4d4]/20 text-[#3b4f73]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-[#3b4f73]/80">
                      <span className="font-medium">Status: </span>
                      {job.status || "Applied"}
                    </div>
                    <div className="text-sm text-[#3b4f73]/80 mt-1">
                      <span className="font-medium">Recruiter Actions: </span>
                      {job.recruiterActions?.invitationSent && (
                        <span className="text-[#89b4d4]">Invitation Sent </span>
                      )}
                      {job.recruiterActions?.resumeDownloaded && (
                        <span className="text-[#89b4d4]">
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
                      className="mt-2 text-[#89b4d4] hover:text-[#3b4f73] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#89b4d4] transition-colors"
                      aria-label={`View details for ${job.title}`}
                    >
                      View Details <ChevronRight size={16} className="inline" />
                    </Link>
                  </div>
                ))}
              </div>
              <Link
                to="/applied"
                className="mt-4 inline-block text-[#89b4d4] hover:text-[#3b4f73] font-semibold focus:outline-none focus:ring-2 focus:ring-[#89b4d4] transition-colors"
                aria-label="View all applied jobs"
              >
                View All Applied Jobs{" "}
                <ChevronRight size={16} className="inline" />
              </Link>
            </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
