import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { BarLoader } from "react-spinners";
import JobCard from "../../components/ui/JobCard";
import { fetchJobs } from "../../store/jobsSlice.js";

// Utility function to get unique jobs
const getUniqueJobs = (jobs) => {
  if (!Array.isArray(jobs)) {
    return [];
  }
  const validJobs = jobs.filter((job) => job && job.id);
  return [...new Map(validJobs.map((job) => [job.id, job])).values()];
};

// Memoized selector to avoid unnecessary re-renders
const selectJobsState = createSelector(
  [(state) => state.jobs],
  (jobsState) => {
    let normalizedJobs = [];
    if (Array.isArray(jobsState?.jobs)) {
      normalizedJobs = jobsState.jobs;
    } else if (Array.isArray(jobsState)) {
      normalizedJobs = jobsState;
    }

    return {
      jobs: normalizedJobs,
      jobsStatus: jobsState?.jobsStatus || "idle",
      jobsError: jobsState?.jobsError || null,
      page: jobsState?.page || 1,
      jobsPerPage: jobsState?.jobsPerPage || 6,
      statusFilter: jobsState?.statusFilter || "all",
      searchQuery: jobsState?.searchQuery || "",
      total: jobsState?.total || 0,
    };
  }
);

const Featured = () => {
  const dispatch = useDispatch();
  const {
    jobs,
    jobsStatus,
    jobsError,
    page,
    jobsPerPage,
    statusFilter,
    searchQuery,
    total,
  } = useSelector(selectJobsState);
  const [displayedJobsCount, setDisplayedJobsCount] = useState(6);

  // Fetch jobs when dependencies change
  useEffect(() => {
    if (jobsStatus !== "loading") {
      dispatch(fetchJobs({ statusFilter, searchQuery, page, jobsPerPage }));
    }
  }, [dispatch, statusFilter, searchQuery, page, jobsPerPage]);

  // Memoize unique jobs
  const uniqueJobs = useMemo(() => getUniqueJobs(jobs), [jobs]);

  // Handle "Load More" button click
  const handleLoadMore = () => {
    const newCount = displayedJobsCount + 6;
    setDisplayedJobsCount(newCount);
    if (newCount > uniqueJobs.length && jobsStatus !== "loading" && uniqueJobs.length < total) {
      dispatch(fetchJobs({ statusFilter, searchQuery, page: page + 1, jobsPerPage }));
    }
  };

  // Slice the jobs to display
  const displayedJobs = uniqueJobs.slice(0, displayedJobsCount);

  // Determine if more jobs are available
  const hasMoreJobs = uniqueJobs.length < total || displayedJobs.length < uniqueJobs.length;

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <h2
        id="featured-jobs-heading"
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center"
      >
        Featured Jobs
      </h2>

      {jobsStatus === "loading" && displayedJobs.length === 0 ? (
        <div className="flex justify-center py-8">
          <BarLoader
            width={200}
            color="#36d7b7"
            aria-label="Loading featured jobs"
          />
          <span className="sr-only">Loading featured jobs...</span>
        </div>
      ) : jobsStatus === "failed" ? (
        <div
          className="text-center text-red-600 p-6 bg-white rounded-lg shadow-sm max-w-2xl mx-auto"
          role="alert"
          aria-live="assertive"
        >
          <p className="mb-4">
            {jobsError?.message ||
              String(jobsError) ||
              "Failed to load jobs. Please try again."}
          </p>
          <button
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            onClick={() =>
              dispatch(fetchJobs({ statusFilter, searchQuery, page, jobsPerPage }))
            }
            aria-label="Retry loading jobs"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedJobs.length > 0 ? (
              displayedJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div
                className="text-center text-gray-600 col-span-full p-6 bg-white rounded-lg shadow-sm"
                role="alert"
                aria-live="polite"
              >
                No jobs found. Try adjusting your search or filters.
              </div>
            )}
          </div>
          {hasMoreJobs && (
            <div className="mt-8 text-center">
              <button
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                onClick={handleLoadMore}
                aria-label="Load more jobs"
                disabled={jobsStatus === "loading"}
              >
                {jobsStatus === "loading" ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Featured;