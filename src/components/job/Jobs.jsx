import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobsByCategoryOrSubcategory } from '../../store/jobsSlice';

const Jobs = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // ✅ Parse query params from URL
  const queryParams = new URLSearchParams(location.search);
  const categoryName = queryParams.get('category');
  const subcategoryName = queryParams.get('subcategory');

  // ✅ Select jobs state from Redux
  const { jobs = [], status, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    // ✅ Only dispatch if a category or subcategory is present
    if (categoryName || subcategoryName) {
      console.log('Fetching jobs for:', { categoryName, subcategoryName });
      dispatch(fetchJobsByCategoryOrSubcategory({ categoryName, subcategoryName }));
    }
  }, [categoryName, subcategoryName, dispatch]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
          {subcategoryName
            ? `Jobs in ${subcategoryName}`
            : categoryName
            ? `Jobs under ${categoryName}`
            : 'All Jobs'}
        </h2>

        {/* ✅ Loading State */}
        {status === 'loading' && (
          <div className="text-center" aria-live="polite">
            <svg
              className="animate-spin h-6 w-6 text-blue-600 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          </div>
        )}

        {/* ✅ Error State */}
        {status === 'failed' && (
          <p className="text-center text-red-600 p-4 bg-red-50 rounded-md" role="alert">
            {error || 'Failed to load jobs. Please try again later.'}
          </p>
        )}

        {/* ✅ Empty State */}
        {status === 'succeeded' && jobs.length === 0 && (
          <p className="text-center text-gray-600 p-4 bg-white rounded-md shadow-sm">
            No jobs found for this category/subcategory.
          </p>
        )}

        {/* ✅ Jobs Grid */}
        {status === 'succeeded' && jobs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id || job._id}
                className="p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300"
              >
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2">
                  {job.title || 'Untitled Job'}
                </h3>
                <p className="text-gray-600 text-sm">{job.company_name || 'Unknown Company'}</p>
                <p className="text-gray-500 text-sm mt-2">{job.location || 'Location not specified'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;
