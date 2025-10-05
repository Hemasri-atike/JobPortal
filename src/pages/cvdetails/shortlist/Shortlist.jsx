import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronRight, Search, Filter, Loader2 } from "lucide-react";
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
        status: "All", 
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

  // Status badge colors
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "shortlisted":
        return "bg-green-100 text-green-800 border-green-200";
      case "interview scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "applied":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden md:block w-64 bg-gray-50 border-r border-gray-200">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Shortlisted Jobs
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredJobs.length} of {totalAppliedJobs} jobs
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="flex-1 max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                    className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none bg-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Applied">Applied</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                <p className="text-gray-600">Loading your shortlisted jobs...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* No shortlisted jobs */}
          {!loading && filteredJobs.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shortlisted jobs yet</h3>
              <p className="text-gray-500 mb-6">Your shortlisted jobs will appear here once you start applying.</p>
              <Link
                to="/jobs"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Browse Jobs
                <ChevronRight size={16} className="ml-2" />
              </Link>
            </div>
          )}

          {/* Display shortlisted jobs */}
          {!loading && filteredJobs.length > 0 && (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        <img
                          src={job.logo || placeholderLogo}
                          alt={job.companyName || "Company logo"}
                          className="w-16 h-16 rounded-lg object-cover shadow-sm"
                          onError={(e) => {
                            e.target.src = placeholderLogo;
                          }}
                        />
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 pr-4 truncate">
                            {job.title || "Untitled Job"}
                          </h3>
                          <Link
                            to={`/job/${job.id}`}
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                          >
                            View Details
                            <ChevronRight size={14} className="ml-1" />
                          </Link>
                        </div>

                        {/* Company and Location */}
                        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {job.companyName || "Unknown Company"}
                          </span>
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            {job.location || "Remote"}
                          </span>
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                            Applied on {job.appliedDate
                              ? new Date(job.appliedDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                              : "N/A"}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(job.status)} mb-3`}>
                          <span className="capitalize">{job.status || "N/A"}</span>
                        </div>

                        {/* Special Messages */}
                        {job.status?.toLowerCase() === "shortlisted" && (
                          <div className="flex items-center text-green-700 font-medium text-sm mb-2">
                            <span className="mr-2">🎉</span>
                            You are shortlisted!
                          </div>
                        )}

                        {job.status?.toLowerCase() === "interview scheduled" && (
                          <div className="flex items-center text-blue-700 font-medium text-sm mb-2">
                            <span className="mr-2">📅</span>
                            Interview on {job.interviewDate
                              ? new Date(job.interviewDate).toLocaleString("en-US", { 
                                  weekday: "short", 
                                  year: "numeric", 
                                  month: "short", 
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit"
                                })
                              : "TBD"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredJobs.length < totalAppliedJobs && (
            <div className="mt-8 text-center">
              <button
                onClick={() => dispatch(incrementPage())}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading more jobs...
                  </>
                ) : (
                  <>
                    Load More Jobs
                    <ChevronRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shortlist;