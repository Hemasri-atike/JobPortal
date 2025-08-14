import React, { useState } from "react";
import { EyeIcon, CheckCircleIcon, XCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

// Mock data for candidates (replace with API data or Context in a real application)
const mockCandidates = [
  {
    id: 1,
    name: "John Doe",
    headline: "Software Engineer",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    status: "New",
    education: [
      {
        degree: "B.Sc. Computer Science",
        institute: "XYZ Institute",
        year: "2020",
        state: "California",
        university: "ABC University",
        college: "DEF College",
        duration: { from: { day: "1", month: "January", year: "2016" }, to: { day: "31", month: "May", year: "2020" } },
      },
    ],
    experience: [
      {
        role: "Junior Developer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        duration: { from: { day: "1", month: "June", year: "2020" }, to: { day: "31", month: "December", year: "2022" } },
        empType: "Full-time",
        employeeId: "EMP123",
      },
    ],
    skills: ["JavaScript", "React", "Node.js"],
    resume: { name: "john_doe_resume.pdf" },
    addresses: { presentAddress: "123 Main St, San Francisco, CA", permanentAddress: "456 Oak Ave, Los Angeles, CA" },
    notes: [],
  },
  {
    id: 2,
    name: "Jane Smith",
    headline: "Data Analyst",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    status: "Reviewing",
    education: [
      {
        degree: "M.Sc. Statistics",
        institute: "PQR Institute",
        year: "2021",
        state: "New York",
        university: "LMN University",
        college: "STU College",
        duration: { from: { day: "1", month: "September", year: "2019" }, to: { day: "31", month: "May", year: "2021" } },
      },
    ],
    experience: [
      {
        role: "Data Analyst",
        company: "Data Inc.",
        location: "New York, NY",
        duration: { from: { day: "1", month: "June", year: "2021" }, to: { day: "31", month: "December", year: "2023" } },
        empType: "Full-time",
        employeeId: "EMP456",
      },
    ],
    skills: ["Python", "SQL", "Tableau"],
    resume: { name: "jane_smith_resume.pdf" },
    addresses: { presentAddress: "789 Pine St, New York, NY", permanentAddress: "101 Elm St, Buffalo, NY" },
    notes: ["Strong analytical skills, recommended for interview."],
  },
];

const Applicants = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  // Filter candidates by status
  const filteredCandidates = filterStatus === "All" ? candidates : candidates.filter((candidate) => candidate.status === filterStatus);

  // Update candidate status
  const updateStatus = (id, newStatus) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === id ? { ...candidate, status: newStatus } : candidate
      )
    );
  };

  // Add note to candidate
  const addNote = (id) => {
    if (noteInput.trim()) {
      setCandidates(
        candidates.map((candidate) =>
          candidate.id === id
            ? { ...candidate, notes: [...candidate.notes, noteInput] }
            : candidate
        )
      );
      setNoteInput("");
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date.day || !date.month || !date.year) return "";
    return `${date.day} ${date.month} ${date.year}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Applicants Management</h2>

        {/* Filter by Status */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Applicants Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Job Title</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Contact Info</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">{candidate.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{candidate.headline}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {candidate.email} <br /> {candidate.phone}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{candidate.status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setNoteInput(""); // Reset note input when opening modal
                      }}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => updateStatus(candidate.id, "Shortlisted")}
                      className="flex items-center text-green-600 hover:text-green-700 disabled:opacity-50"
                      title="Shortlist"
                      disabled={candidate.status === "Shortlisted"}
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-1" />
                      Shortlist
                    </button>
                    <button
                      onClick={() => updateStatus(candidate.id, "Rejected")}
                      className="flex items-center text-red-600 hover:text-red-700 disabled:opacity-50"
                      title="Reject"
                      disabled={candidate.status === "Rejected"}
                    >
                      <XCircleIcon className="w-5 h-5 mr-1" />
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Candidate Details Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {selectedCandidate.name} - {selectedCandidate.headline}
              </h3>
              <div className="space-y-4">
                {/* Contact Info */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700">Contact Info</h4>
                  <p className="text-sm text-gray-600">Email: {selectedCandidate.email}</p>
                  <p className="text-sm text-gray-600">Phone: {selectedCandidate.phone}</p>
                </div>
                {/* Education */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700">Education</h4>
                  {selectedCandidate.education.map((edu, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      {edu.degree} - {edu.institute}, {edu.college}, {edu.university}, {edu.state} (
                      {edu.year}, {formatDate(edu.duration.from)} - {formatDate(edu.duration.to)})
                    </div>
                  ))}
                </div>
                {/* Experience */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700">Experience</h4>
                  {selectedCandidate.experience.map((exp, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      {exp.role} at {exp.company}, {exp.location} ({formatDate(exp.duration.from)} -{" "}
                      {formatDate(exp.duration.to)}, {exp.empType}, ID: {exp.employeeId})
                    </div>
                  ))}
                </div>
                {/* Skills */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Resume */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700">Resume</h4>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                    onClick={() => alert(`Download ${selectedCandidate.resume.name}`)} // Replace with actual download logic
                  >
                    <DocumentTextIcon className="w-5 h-5 mr-1" />
                    {selectedCandidate.resume.name}
                  </a>
                </div>
                {/* Addresses */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700">Addresses</h4>
                  <p className="text-sm text-gray-600">Present: {selectedCandidate.addresses.presentAddress}</p>
                  <p className="text-sm text-gray-600">Permanent: {selectedCandidate.addresses.permanentAddress}</p>
                </div>
                {/* Notes */}
                <div>
                  <h4 className="text-lg font-medium text-gray-700">Notes</h4>
                  <div className="space-y-2">
                    {selectedCandidate.notes.length > 0 ? (
                      selectedCandidate.notes.map((note, idx) => (
                        <p key={idx} className="text-sm text-gray-600 border-l-4 border-blue-500 pl-2">
                          {note}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No notes added.</p>
                    )}
                  </div>
                  <div className="mt-2">
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add a note..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => addNote(selectedCandidate.id)}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;