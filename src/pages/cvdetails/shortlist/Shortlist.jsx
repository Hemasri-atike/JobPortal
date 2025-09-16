import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronRight, Search, Mail, Download } from "lucide-react";
import Header from "../../navbar/Header";
import Sidebar from "../layout/Sidebar";
import {
  fetchJobs,
  setStatusFilter,
  setSearchQuery,
  incrementPage,
  clearFilters,
} from "../../../store/jobsSlice.js";

// Import the default image from the assets folder
import placeholderLogo from "../../../images/img.png"; // Adjust path based on your project structure

const Shortlist = () => {
  const dispatch = useDispatch();
  const {
    jobs,
    total,
    jobsStatus,
    jobsError,
    statusFilter,
    searchQuery,
    page,
    jobsPerPage,
  } = useSelector((state) => state.jobs);

  // Fetch jobs whenever filters/search/page changes
  useEffect(() => {
    dispatch(fetchJobs({ statusFilter, searchQuery, page, jobsPerPage }));
  }, [statusFilter, searchQuery, page, jobsPerPage, dispatch]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden md:block w-64 bg-gray-100">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4 sm:p-6 bg-gray-100 overflow-y-auto">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            Shortlisted Jobs
          </h4>

          {jobsStatus === "loading" && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          )}

          {jobsStatus === "failed" && (
            <p className="text-red-600 text-center">{jobsError}</p>
          )}

          {jobsStatus === "succeeded" && (
            <>
              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by job title or company"
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    aria-label="Search jobs by title or company"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                  className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  aria-label="Filter jobs by status"
                >
                  <option value="All">All Statuses</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                </select>
                {(searchQuery || statusFilter !== "All") && (
                  <button
                    onClick={() => dispatch(clearFilters())}
                    className="text-sm text-blue-600 hover:underline"
                    aria-label="Clear filters"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Job List */}
              {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow p-5 flex flex-col">
                      <div className="flex items-center mb-4">
                        <img
                          src={job.logo || placeholderLogo} // Use imported default image
                          alt={job.company ? `${job.company} logo` : "Default company logo"} // Consistent alt text
                          className="w-12 h-12 rounded"
                          onError={(e) => {
                            e.target.src = placeholderLogo; // Fallback to imported default image
                          }}
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                            {job.title || "Untitled Job"}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                            <span>{job.company || "Unknown Company"}</span>
                            <span>•</span>
                            <span>{job.location || "Unknown Location"}</span>
                            <span>•</span>
                            <span>
                              Applied {job.appliedDate || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                             {job.salary || "Not specified"}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {job.tags && job.tags.length > 0 ? (
                              job.tags.map((tag) => (
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
                              ))
                            ) : (
                              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                No tags
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Status: </span>
                        {job.status || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Recruiter Actions: </span>
                        {job.recruiterActions?.invitationSent && (
                          <span className="text-green-600">
                            <Mail size={14} className="inline mr-1" /> Invitation Sent
                          </span>
                        )}
                        {job.recruiterActions?.resumeDownloaded && (
                          <span className="text-yellow-600 ml-2">
                            <Download size={14} className="inline mr-1" /> Resume Downloaded
                          </span>
                        )}
                        {!job.recruiterActions?.invitationSent &&
                          !job.recruiterActions?.resumeDownloaded && (
                            <span>No additional actions</span>
                          )}
                      </div>

                      <Link
                        to={`/job/${job.id}`}
                        className="mt-2 text-blue-600 hover:underline text-sm flex items-center"
                        aria-label={`View details for ${job.title || "job"}`}
                      >
                        View Details <ChevronRight size={16} className="inline ml-1" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-100 text-center">No jobs found.</p>
              )}

              {/* Load More Button */}
              {jobs.length < total && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => dispatch(incrementPage())}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={jobsStatus === "loading"}
                    aria-label="Load more jobs"
                  >
                    {jobsStatus === "loading" ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shortlist;