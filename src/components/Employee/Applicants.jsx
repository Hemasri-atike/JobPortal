import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicantsByJob } from "../../store/jobsSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaList, FaTh } from "react-icons/fa";

const Applicants = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();

  const applicants = useSelector(
    (state) => (state.jobs.applicants && state.jobs.applicants[jobId]) || []
  );
  const applicantsStatus = useSelector((state) => state.jobs.applicantsStatus || "idle");
  const applicantsError = useSelector((state) => state.jobs.applicantsError || null);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // Fetch applicants when jobId changes
  useEffect(() => {
    if (jobId && applicantsStatus === "idle") {
      dispatch(fetchApplicantsByJob({ jobId }))
        .unwrap()
        .then((res) => console.log(" Applicants fetched:", res))
        .catch((err) => {
          console.error(" Failed to fetch applicants:", err);
          toast.error("Failed to load applicants");
        });
    }
  }, [dispatch, jobId, applicantsStatus]);

  // Filter applicants based on search term
  const filteredApplicants = applicants.filter((applicant) => {
    const match =
      applicant.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.skills?.join(",").toLowerCase().includes(searchTerm.toLowerCase());
    return match;
  });

  if (applicantsStatus === "loading") return <p className="text-gray-600 text-lg">Loading applicants...</p>;
  if (applicantsStatus === "failed") return <p className="text-red-600 text-lg">Error: {applicantsError}</p>;
  if (!jobId)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Job ID is missing in the URL. Please go back and select a job.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Applicants for Job #{jobId}</h1>

        {/* Search + View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm pl-10"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg ${viewMode === "table" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              <FaList />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-lg ${viewMode === "card" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              <FaTh />
            </button>
          </div>
        </div>

        {/* Applicants */}
        {filteredApplicants.length === 0 ? (
          <p className="text-gray-600 text-lg">No applicants found for this job.</p>
        ) : viewMode === "table" ? (
          <table className="min-w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Resume</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant, index) => (
                <tr key={applicant.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{applicant.fullName || "N/A"}</td>
                  <td className="px-4 py-2">{applicant.email || "N/A"}</td>
                  <td className="px-4 py-2">
                    {applicant.resume ? (
                      <a
                        href={`http://localhost:5000/${applicant.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid gap-6">
            {filteredApplicants.map((applicant) => (
              <div key={applicant.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <p><strong>Name:</strong> {applicant.fullName || "N/A"}</p>
                <p><strong>Email:</strong> {applicant.email || "N/A"}</p>
                <p><strong>Phone:</strong> {applicant.phone || "N/A"}</p>
                <p><strong>Location:</strong> {applicant.location || "N/A"}</p>
                <p><strong>Experience:</strong> {applicant.experience || "N/A"}</p>
                <p><strong>Skills:</strong> {applicant.skills?.join(", ") || "N/A"}</p>
                <p>
                  <strong>Resume:</strong>{" "}
                  {applicant.resume ? (
                    <a
                      href={`http://localhost:5000/${applicant.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <strong>Applied On:</strong>{" "}
                  {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Applicants;
