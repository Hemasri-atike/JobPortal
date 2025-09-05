import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { BarLoader } from "react-spinners";
import JobCard from "../../components/ui/JobCard";
import { fetchJobs } from "../../store/jobsSlice";

// Utility function to get unique jobs
const getUniqueJobs = (jobs) => {
  if (!Array.isArray(jobs)) {
    console.log("getUniqueJobs: jobs is not an array", jobs);
    return [];
  }
  // Filter out jobs without an id to prevent errors
  const validJobs = jobs.filter((job) => job && job.id);
  console.log("getUniqueJobs: validJobs", validJobs);
  return [...new Map(validJobs.map((job) => [job.id, job])).values()];
};

// Memoized selector to avoid unnecessary re-renders
const selectJobsState = createSelector(
  [(state) => state.jobs],
  (jobsState) => {
    console.log("selectJobsState: jobs state", jobsState);

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
    console.log("Dispatching fetchJobs with:", {
      statusFilter,
      searchQuery,
      page,
      jobsPerPage,
    });
    dispatch(fetchJobs({ statusFilter, searchQuery, page, jobsPerPage }));
  }, [dispatch, statusFilter, searchQuery, page, jobsPerPage]);

  // Memoize unique jobs
  const uniqueJobs = useMemo(() => getUniqueJobs(jobs), [jobs]);

  // Log rendering state for debugging
  console.log("Featured rendering:", { jobsStatus, jobsError, uniqueJobs });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h2
        id="featured-jobs-heading"
        className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-8 text-center"
      >
        Featured Jobs
      </h2>

      {jobsStatus === "loading" ? (
        <div className="flex justify-center">
          <BarLoader width="200px" color="#36d7b7" aria-label="Loading jobs" />
        </div>
      ) : jobsStatus === "failed" ? (
        <div
          className="text-center text-red-600 p-4"
          role="alert"
          aria-live="assertive"
        >
          {jobsError?.message ||
            String(jobsError) ||
            "Failed to load jobs. Please try again."}
          <button
            className="ml-2 text-blue-600 hover:underline"
            onClick={() =>
              dispatch(fetchJobs({ statusFilter, searchQuery, page, jobsPerPage }))
            }
            aria-label="Retry loading jobs"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {uniqueJobs.length ? (
            uniqueJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div
              className="text-center text-gray-600 col-span-full p-4"
              role="alert"
              aria-live="polite"
            >
              No Jobs Found 😢. Try adjusting your search or filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Featured;
