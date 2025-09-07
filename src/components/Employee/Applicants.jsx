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
  setApplicantSearchQuery,
  setApplicantStatusFilter,
  setApplicantPage,
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
    applicantsStatus,
    applicantsError,
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

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await dispatch(updateApplicantStatus({ id, status: newStatus })).unwrap();
      toast.success("Status updated successfully!");
    } catch (err) {
      toast.error("Failed to update status: " + err);
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
      toast.error("Failed to add note: " + err);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    dispatch(setApplicantSearchQuery(e.target.value));
    dispatch(setApplicantPage(1)); // Reset to first page on search
  };

  // Handle pagination
  const totalPages = Math.ceil(total / jobsPerPage);

  if (applicantsStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (applicantsError) {
    return (
      <div className="text-center mt-10 text-red-600">
        Error: {applicantsError}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Applicants</h2>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or position"
          className="border rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={handleSearch}
        />
        <div className="flex flex-wrap gap-2">
          {["All", "Applied", "Interviewed", "Rejected"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg transition shadow-sm ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border hover:bg-gray-100"
              }`}
              onClick={() => dispatch(setApplicantStatusFilter(status))}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applicant Cards */}
      {applicants.length === 0 ? (
        <div className="text-center text-gray-600">No applicants found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {candidate.name}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    candidate.status === "Applied"
                      ? "bg-yellow-100 text-yellow-700"
                      : candidate.status === "Interviewed"
                      ? "bg-blue-100 text-blue-700"
                      : candidate.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {candidate.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">{candidate.email}</p>
              <p className="text-gray-600 text-sm">{candidate.mobile}</p>
              <p className="mt-3 text-gray-700 font-medium">
                {candidate.position}
              </p>
              {candidate.resume && (
                <a
                  href={candidate.resume}
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              )}

              {/* Actions */}
              <div className="flex items-center mt-4 space-x-3">
                <button
                  className="flex items-center text-green-600 hover:text-green-800"
                  onClick={() => handleStatusUpdate(candidate.id, "Interviewed")}
                >
                  <CheckCircleIcon className="h-5 w-5 mr-1" />
                  Interview
                </button>
                <button
                  className="flex items-center text-red-600 hover:text-red-800"
                  onClick={() => handleStatusUpdate(candidate.id, "Rejected")}
                >
                  <XCircleIcon className="h-5 w-5 mr-1" />
                  Reject
                </button>
                <button
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <EyeIcon className="h-5 w-5 mr-1" />
                  View
                </button>
              </div>

              {/* Notes */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a note"
                    className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                  />
                  <button
                    onClick={() => handleAddNote(candidate.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <ul className="mt-3 space-y-1">
                  {(Array.isArray(candidate.notes) ? candidate.notes : []).map(
                    (note, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-start"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-500" />
                        {note}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            onClick={() => dispatch(setApplicantPage(page - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            onClick={() => dispatch(setApplicantPage(page + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedCandidate.name}
            </h3>
            <p className="text-gray-700">Email: {selectedCandidate.email}</p>
            <p className="text-gray-700">Mobile: {selectedCandidate.mobile}</p>
            <p className="text-gray-700">Position: {selectedCandidate.position}</p>
            <p className="text-gray-700">
              Status: <span className="font-semibold">{selectedCandidate.status}</span>
            </p>
            {selectedCandidate.resume && (
              <a
                href={selectedCandidate.resume}
                className="text-blue-600 hover:underline mt-2 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Resume
              </a>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Applicants;