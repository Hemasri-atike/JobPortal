import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchApplicants,
  updateApplicantStatus,
  addApplicantNote,
  setSearchQuery,        // Fixed: from setApplicantSearchQuery
  setStatusFilter,       // Fixed: from setApplicantStatusFilter
  setPage,               // Fixed: from setApplicantPage
  clearError,            // Added: to clear errors
} from "../../store/applicantSlice.js"; // Use applicantSlice

const Applicants = () => {
  const dispatch = useDispatch();
  const {
    applicants = [], // Default to empty array
    total = 0,
    page = 1,
    jobsPerPage = 8,
    statusFilter = "All",
    searchQuery = "",
    status,            // Fixed: from applicantsStatus
    error,             // Fixed: from applicantsError
  } = useSelector((state) => state.applicants); // Use state.applicants

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  // Fetch applicants when component mounts or filters change
  useEffect(() => {
    dispatch(
      fetchApplicants({
        statusFilter,
        searchQuery,
        page,
        jobsPerPage,
      })
    );
  }, [dispatch, statusFilter, searchQuery, page, jobsPerPage]);

  // Clear error on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await dispatch(updateApplicantStatus({ id, status: newStatus })).unwrap();
      toast.success("Status updated successfully!");
    } catch (err) {
      toast.error("Failed to update status: " + (err.message || err));
    }
  };

  // Handle adding note
  const handleAddNote = async (id) => {
    if (!noteInput.trim()) {
      toast.error("Note cannot be empty!");
      return;
    }
    try {
      await dispatch(addApplicantNote({ id, note: noteInput })).unwrap();
      toast.success("Note added successfully!");
      setNoteInput("");
    } catch (err) {
      toast.error("Failed to add note: " + (err.message || err));
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));  // Fixed: use setSearchQuery
    dispatch(setPage(1));             // Fixed: use setPage
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    dispatch(setStatusFilter(filter));  // Fixed: use setStatusFilter
    dispatch(setPage(1));               // Fixed: use setPage
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));         // Fixed: use setPage
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / jobsPerPage);

  // Loading state
  if (status === "loading") {  // Fixed: use status
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {  // Fixed: use error
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Applicants</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applicants</h1>
        <p className="text-gray-600">Manage and review job applications</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Applied", "Under Review", "Interview Scheduled", "Shortlisted", "Rejected"].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
                  statusFilter === filter
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applicants Grid */}
      {applicants.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applicants Found</h3>
          <p className="text-gray-600">
            {statusFilter !== "All" ? `No applicants with status "${statusFilter}".` : "No applicants yet."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {candidate.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {candidate.email || "N/A"} • {candidate.phone || candidate.mobile || "N/A"}
                  </p>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                    candidate.status === "Applied"
                      ? "bg-yellow-100 text-yellow-800"
                      : candidate.status === "Under Review"
                      ? "bg-blue-100 text-blue-800"
                      : candidate.status === "Shortlisted"
                      ? "bg-green-100 text-green-800"
                      : candidate.status === "Interview Scheduled"
                      ? "bg-indigo-100 text-indigo-800"
                      : candidate.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {candidate.status || "Applied"}
                </span>
              </div>

              {/* Job Details */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 font-medium">
                  {candidate.jobTitle || candidate.position || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {candidate.company || "N/A"}
                </p>
              </div>

              {/* Resume Link */}
              {candidate.resume && (
                <a
                  href={candidate.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm mb-4 font-medium"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  View Resume
                </a>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleStatusUpdate(candidate.id, "Interview Scheduled")}
                  className="flex items-center px-3 py-1 bg-green-50 text-green-700 text-sm rounded-md hover:bg-green-100 transition-colors"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Schedule Interview
                </button>
                <button
                  onClick={() => handleStatusUpdate(candidate.id, "Shortlisted")}
                  className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md hover:bg-blue-100 transition-colors"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleStatusUpdate(candidate.id, "Rejected")}
                  className="flex items-center px-3 py-1 bg-red-50 text-red-700 text-sm rounded-md hover:bg-red-100 transition-colors"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Reject
                </button>
              </div>

              {/* Quick View Button */}
              <button
                onClick={() => setSelectedCandidate(candidate)}
                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-700 text-sm rounded-md hover:bg-indigo-100 transition-colors mb-4"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Quick View
              </button>

              {/* Notes Section */}
              <div className="border-t pt-4">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add a quick note..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                  />
                  <button
                    onClick={() => handleAddNote(candidate.id)}
                    disabled={!noteInput.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>
                {candidate.notes && candidate.notes.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {candidate.notes.map((note, idx) => (
                      <div key={idx} className="flex items-start p-2 bg-gray-50 rounded-lg">
                        <DocumentTextIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{note}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No notes yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2 bg-white p-4 rounded-xl shadow-sm">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedCandidate.name || "N/A"}
              </h3>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900 mt-1">{selectedCandidate.email || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-gray-900 mt-1">{selectedCandidate.phone || selectedCandidate.mobile || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Position:</span>
                <p className="text-gray-900 mt-1">{selectedCandidate.jobTitle || selectedCandidate.position || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Company:</span>
                <p className="text-gray-900 mt-1">{selectedCandidate.company || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ml-2 ${
                  selectedCandidate.status === "Applied"
                    ? "bg-yellow-100 text-yellow-800"
                    : selectedCandidate.status === "Under Review"
                    ? "bg-blue-100 text-blue-800"
                    : selectedCandidate.status === "Shortlisted"
                    ? "bg-green-100 text-green-800"
                    : selectedCandidate.status === "Interview Scheduled"
                    ? "bg-indigo-100 text-indigo-800"
                    : selectedCandidate.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {selectedCandidate.status || "Applied"}
                </span>
              </div>
              {selectedCandidate.resume && (
                <div>
                  <span className="font-medium text-gray-700">Resume:</span>
                  <a
                    href={selectedCandidate.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium mt-1 inline-block"
                  >
                    Download Resume
                  </a>
                </div>
              )}
              {selectedCandidate.coverLetter && (
                <div>
                  <span className="font-medium text-gray-700">Cover Letter:</span>
                  <a
                    href={selectedCandidate.coverLetter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium mt-1 inline-block"
                  >
                    View Cover Letter
                  </a>
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
              {selectedCandidate.notes && selectedCandidate.notes.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedCandidate.notes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                      {note}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No notes added yet</p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Applicants;