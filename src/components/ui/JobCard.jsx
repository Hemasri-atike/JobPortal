import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // <-- import this
import Application from "../../components/job/Application";

const JobCard = ({ job }) => {
  const navigate = useNavigate(); // <-- initialize navigate
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { applications = [] } = useSelector((state) => state.jobs || {});
  const hasApplied = job?.id ? applications.includes(job.id) : false;

  if (!job || !job.id) {
    console.error("Invalid job data in JobCard:", job);
    return null;
  }

  const {
    id,
    title = "Untitled Job",
    company_name = "Unknown Company",
    location = "Location not specified",
    tags = [],
    description = "No description available",
    salary = "Not specified",
  } = job;

  const handleApply = () => {
    if (!id) return;
    if (hasApplied) {
      alert("You have already applied to this job.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleViewDetails = () => {
    navigate(`/jobdescription/${id}`); // <-- navigate to JobDescription page with jobId
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 border border-gray-100 max-w-full hover:border-blue-200 cursor-pointer"
        role="article"
        aria-labelledby={`job-title-${id}`}
        onClick={handleViewDetails} // <-- click anywhere on card navigates
      >
        <div className="flex flex-col gap-1">
          <h3
            id={`job-title-${id}`}
            className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-1"
          >
            {title}
          </h3>
          <p className="text-sm font-medium text-gray-600">{company_name}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{salary}</span>
          </div>
        </div>

        {(tags || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(tags || []).map((tag, i) => (
              <span
                key={`${id}-${tag}-${i}`}
                className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default JobCard;
