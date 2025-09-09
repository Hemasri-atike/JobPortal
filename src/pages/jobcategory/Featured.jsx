import { useEffect, useMemo } from "react";
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
  // Filter out jobs without an id to prevent errors
  const validJobs = jobs.filter((job) => job && job.id);
  return [...new Map(validJobs.map((job) => [job.id, job])).values()];
};

// Memoized selector to avoid unnecessary re-renders
const selectJobsState = createSelector(
  [(state) => state.jobs],
  (jobsState) => {
    // Always normalize jobs into an array
    let normalizedJobs = [];
    if (Array.isArray(jobsState?.jobs)) {
      normalizedJobs = jobsState.jobs;
    } else if (Array.isArray(jobsState)) {
      normalizedJobs = jobsState; // in case reducer sets jobs directly as an array
    }

    return {
      jobs: normalizedJobs,
      jobsStatus: jobsState?.jobsStatus || "idle",
      jobsError: jobsState?.jobsError || null,
      page: jobsState?.page || 1,
      jobsPerPage: jobsState?.jobsPerPage || 5,
      statusFilter: jobsState?.statusFilter || "all",
      searchQuery: jobsState?.searchQuery || "",
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
  } = useSelector(selectJobsState);

  // Fetch jobs when dependencies change
  useEffect(() => {
    dispatch(fetchJobs({ statusFilter, searchQuery, page, jobsPerPage }));
  }, [dispatch, statusFilter, searchQuery, page, jobsPerPage]);

  // Memoize unique jobs
  const uniqueJobs = useMemo(() => getUniqueJobs(jobs), [jobs]);

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <h2
        id="featured-jobs-heading"
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center"
      >
        Featured Jobs
      </h2>

      {jobsStatus === "loading" ? (
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
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {uniqueJobs.length ? (
            uniqueJobs.map((job) => <JobCard key={job.id} job={job} />)
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
      )}
    </section>
  );
};

export default Featured;