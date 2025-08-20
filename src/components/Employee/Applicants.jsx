import React, { useState, useEffect } from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const Applicants = () => {
  const [candidates, setCandidates] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch applicants from API
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/applicants");
        setCandidates(res.data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  // Filter candidates by status
  const filteredCandidates =
    filterStatus === "All"
      ? candidates
      : candidates.filter((candidate) => candidate.status === filterStatus);

  // Update status locally
  const updateStatus = (id, newStatus) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === id ? { ...candidate, status: newStatus } : candidate
      )
    );
  };

  // Add note locally
  const addNote = (id) => {
    if (noteInput.trim()) {
      setCandidates(
        candidates.map((candidate) =>
          candidate.id === id
            ? { ...candidate, notes: [...(candidate.notes || []), noteInput] }
            : candidate
        )
      );
      setNoteInput("");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading applicants...</p>;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Applicants</h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["All", "Applied", "Interviewed", "Rejected"].map((status) => (
          <button
            key={status}
            className={`px-5 py-2 rounded-lg transition shadow-sm ${
              filterStatus === status
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border hover:bg-gray-100"
            }`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Candidate Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
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

            <p className="text-gray-600 text-sm mt-3">{candidate.email}</p>
            <p className="text-gray-600 text-sm">{candidate.mobile}</p>
            <p className="mt-4 text-gray-700 font-medium">
              {candidate.position}
            </p>

            {/* Actions */}
            <div className="flex items-center mt-5 space-x-4 text-sm">
              <button
                className="flex items-center text-green-600 hover:text-green-800"
                onClick={() => updateStatus(candidate.id, "Interviewed")}
              >
                <CheckCircleIcon className="h-5 w-5 mr-1" />
                Interview
              </button>
              <button
                className="flex items-center text-red-600 hover:text-red-800"
                onClick={() => updateStatus(candidate.id, "Rejected")}
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
            <div className="mt-5">
              {/* <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a note"
                  className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <button
                  onClick={() => addNote(candidate.id)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
                >
                  Add
                </button>
              </div> */}
              {/* <ul className="mt-3 space-y-1">
                {(candidate.notes || []).map((note, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-600 flex items-start"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-500" />
                    {note}
                  </li>
                ))}
              </ul> */}
              {/* <ul className="mt-2 space-y-1">
  {(() => {
    let notes = [];
    if (Array.isArray(candidate.notes)) {
      notes = candidate.notes;
    } else if (typeof candidate.notes === 'string') {
      try {
        notes = JSON.parse(candidate.notes);
        if (!Array.isArray(notes)) {
          notes = [candidate.notes];
        }
      } catch {
        notes = candidate.notes.split(",");
      }
    }
    return notes;
  })().map((note, idx) => (
    <li key={idx} className="text-sm text-gray-600 flex items-start">
      <DocumentTextIcon className="h-4 w-4 mr-1 text-gray-500" />
      {note.trim()}
    </li>
  ))}
</ul> */}
{(() => {
  let notes = [];

  if (Array.isArray(candidate.notes)) {
    notes = candidate.notes;
  } else if (typeof candidate.notes === 'string') {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(candidate.notes);
      notes = Array.isArray(parsed) ? parsed : [candidate.notes];
    } catch {
      // Fallback: treat string as comma-separated
      notes = candidate.notes.split(",").map(n => n.trim());
    }
  }

  return notes.map((note, idx) => (
    <li key={idx}>{note}</li>
  ));
})()}


            </div>
          </div>
        ))}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {selectedCandidate.name}
            </h3>
            <p className="text-gray-700">{selectedCandidate.email}</p>
            <p className="text-gray-700">{selectedCandidate.mobile}</p>
            <p className="text-gray-700">{selectedCandidate.position}</p>
            <p className="text-gray-700 mt-3">
              Status:{" "}
              <span className="font-semibold">{selectedCandidate.status}</span>
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
