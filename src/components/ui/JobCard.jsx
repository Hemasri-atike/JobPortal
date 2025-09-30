import { useState } from 'react';
import { useSelector } from 'react-redux';
import Application from '../../components/job/Application';

const JobCard = ({ job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { applications = [] } = useSelector((state) => state.jobs || {});
  const hasApplied = job?.id ? applications.includes(job.id) : false;

  // Validate job and job.id
  if (!job || !job.id) {
    console.error('Invalid job data in JobCard:', job);
    return null;
  }

 const {
  id,
  title = 'Untitled Job',
  company_name = 'Unknown Company',
  location = 'Location not specified',
  tags = [], // fallback to empty array
  description = 'No description available',
  salary = 'Not specified',
} = job || {};


  const handleApply = () => {
    if (!id) {
      console.error('Cannot apply: job.id is undefined', job);
      alert('Cannot apply to this job. Please try another.');
      return;
    }
    if (hasApplied) {
      alert('You have already applied to this job.');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Job Card Container */}
      <div
        className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 border border-gray-100 max-w-full hover:border-blue-200"
        role="article"
        aria-labelledby={`job-title-${id}`}
      >
        {/* Header: Job Title and Company */}
        <div className="flex flex-col gap-1">
          <h3
            id={`job-title-${id}`}
            className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-1"
          >
            {title}
          </h3>
          <p className="text-sm font-medium text-gray-600">{company_name}</p>
        </div>

        {/* Metadata: Location and Salary */}
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

        {/* Tags */}
        {/* {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={`${id}-${tag}-${i}`}
                className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )} */}


        {(tags || []).length > 0 && (
  <div className="flex flex-wrap gap-2">
    {(tags || []).map((tag, i) => (
      <span key={`${id}-${tag}-${i}`} className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
        {tag}
      </span>
    ))}
  </div>
)}


        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{description}</p>

        {/* Apply Button */}
        <button
          className={`mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold text-white w-full sm:w-fit transition-colors duration-200 self-end ${
            hasApplied || !id
              ? 'bg-[#4A628A] cursor-not-allowed'
              : 'bg-[#4A628A] focus:ring-4 focus:ring-blue-200 focus:outline-none'
          }`}
          onClick={handleApply}
          disabled={hasApplied || !id}
          aria-label={hasApplied ? `Already applied to ${title} at ${company_name}` : `Apply for ${title} at ${company_name}`}
        >
          {hasApplied ? 'Applied' : 'Apply Now'}
        </button>
      </div>

      {/* Application Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-modal-title"
        >
          <div className="bg-white rounded-2xl w-full max-w-lg sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h2
                id="application-modal-title"
                className="text-xl sm:text-2xl font-bold text-gray-900"
              >
                Apply for {title} at {company_name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-medium"
                aria-label="Close application modal"
              >
                ✕
              </button>
            </div>
            <Application job={job} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;