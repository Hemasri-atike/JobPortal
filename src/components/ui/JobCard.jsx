import { useState } from 'react';
import { useSelector } from 'react-redux';
import Application from '../../components/job/Application';

const JobCard = ({ job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { applications } = useSelector((state) => state.jobs || {});
  const hasApplied = applications.includes(job.id);

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
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{company_name}</p>
        <p className="text-sm text-gray-400">{location}</p>
        <p className="text-sm text-gray-500 mt-1">Salary: {salary}</p>
        {/* <p className="text-sm text-gray-500 mt-1">Status: {status}</p> */}

        {tags.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
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

        <p className="mt-4 text-gray-600">{description}</p>
        <button
          className={`mt-4 px-4 py-2 rounded-lg text-sm text-white ${
            hasApplied
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={() => setIsModalOpen(true)}
          disabled={hasApplied}
          aria-label={hasApplied ? 'Already applied' : 'Apply for job'}
        >
          {hasApplied ? 'Applied' : 'Apply Now'}
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-modal-title"
        >
          <div className="bg-white rounded-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2
                id="application-modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                Apply for {title} at {company_name}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
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