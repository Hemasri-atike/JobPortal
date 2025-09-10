import { useState } from 'react';
import { useSelector } from 'react-redux';
import Application from '../../components/job/Application';

const JobCard = ({ job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { applications } = useSelector((state) => state.jobs || {});
  const hasApplied = applications?.includes(job.id) || false;

  if (!job) return null;

  const {
    id,
    title = 'Untitled Job',
    company_name = 'Unknown Company',
    location = 'Location not specified',
    tags = [],
    description = 'No description available',
    salary = 'Not specified',
    status = 'Not specified',
  } = job;

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition duration-300 flex flex-col min-h-[240px] max-w-full border border-gray-200">
        <div className="mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-500">{company_name}</p>
        </div>

        <div className="text-sm text-gray-400 mb-2">
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            </svg>
            {location}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-2">Salary: {salary}</p>
        {/* <p className="text-sm text-gray-500 mb-2">Status: {status}</p> */}

        {tags.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {tags.map((tag, i) => (
              <span
                key={`${id}-${tag}-${i}`}
                className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-600 flex-grow line-clamp-2">{description}</p>

        <button
          className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium text-white w-full sm:w-auto self-end ${
            hasApplied
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
          onClick={() => setIsModalOpen(true)}
          disabled={hasApplied}
          aria-label={hasApplied ? 'Already applied' : `Apply for ${title} at ${company_name}`}
        >
          {hasApplied ? 'Applied' : 'Apply Now'}
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-modal-title"
        >
          <div className="bg-white rounded-lg w-full max-w-lg sm:max-w-2xl lg:max-w-3xl overflow-y-auto max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h2
                id="application-modal-title"
                className="text-lg sm:text-xl font-semibold text-gray-900"
              >
                Apply for {title} at {company_name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-lg"
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