import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "../../navbar/Header";
import Sidebar from "../layout/Sidebar";
import {
  fetchAppliedJobs,
  setSearchQuery,
  setStatusFilter,
  incrementPage,
} from "../../../store/jobsSlice";
import placeholderLogo from "../../../images/img.png";

const Shortlist = () => {
  const dispatch = useDispatch();
  const {
    appliedJobs,
    totalAppliedJobs,
    loading,
    error,
    searchQuery,
    statusFilter,
    page,
    jobsPerPage,
  } = useSelector((state) => state.jobs);

  // Fetch applied jobs whenever search, statusFilter, or page changes
  useEffect(() => {
    dispatch(
      fetchAppliedJobs({
        search: searchQuery,
        status: "All", // Fetch all applied jobs; we'll filter locally for shortlist
        page,
        limit: jobsPerPage,
      })
    );
  }, [dispatch, searchQuery, page, jobsPerPage]);

  // Filter jobs for shortlist and apply local search & statusFilter
const filteredJobs = appliedJobs.filter((job) => {
  const jobStatus = (job.status || "").toLowerCase();
  const selectedStatus = (statusFilter || "All").toLowerCase();

  const matchesSearch = job.title
    ?.toLowerCase()
    .includes(searchQuery.toLowerCase());

  // Decide which statuses to show
  const shortlistedStatuses = ["shortlisted", "interview scheduled", "rejected"];

  const matchesStatus =
    selectedStatus === "all"
      ? shortlistedStatuses.includes(jobStatus)
      : jobStatus === selectedStatus;

  return matchesSearch && matchesStatus;
});


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden md:block w-64 bg-gray-100">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 sm:p-6 bg-gray-100 overflow-y-auto">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            My Shortlisted Jobs
          </h4>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by job title..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Applied">Applied</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          )}

          {/* Error */}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* No shortlisted jobs */}
          {!loading && filteredJobs.length === 0 && (
            <p className="text-gray-500 text-center">No shortlisted jobs found.</p>
          )}

          {/* Display shortlisted jobs */}
          {!loading && filteredJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow p-5 flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={job.logo || placeholderLogo}
                      alt={job.companyName || "Company logo"}
                      className="w-12 h-12 rounded"
                      onError={(e) => {
                        e.target.src = placeholderLogo;
                      }}
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                        {job.title || "Untitled Job"}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                        <span>{job.companyName || "Unknown Company"}</span>
                        <span>•</span>
                        <span>{job.location || "Unknown Location"}</span>
                        <span>•</span>
                        <span>
                          Applied{" "}
                          {job.appliedDate
                            ? new Date(job.appliedDate).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Status: </span>
                    {job.status || "N/A"}
                  </div>

                  {job.status.toLowerCase() === "shortlisted" && (
                    <div className="text-green-600 font-medium mb-1">
                      🎉 You are shortlisted!
                    </div>
                  )}

                  {job.status.toLowerCase() === "interview scheduled" && (
                    <div className="text-blue-600 font-medium mb-1">
                      📅 Interview on:{" "}
                      {job.interviewDate
                        ? new Date(job.interviewDate).toLocaleString()
                        : "TBD"}
                    </div>
                  )}

                  <Link
                    to={`/job/${job.id}`}
                    className="mt-2 text-blue-600 hover:underline text-sm flex items-center"
                  >
                    View Job Details{" "}
                    <ChevronRight size={16} className="inline ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredJobs.length < totalAppliedJobs && (
            <div className="mt-6 text-center">
              <button
                onClick={() => dispatch(incrementPage())}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shortlist;
