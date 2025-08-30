import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarLoader } from "react-spinners";
import JobCard from "../../components/ui/JobCard";
import { fetchJobs } from "../../store/jobsSlice";

const Featured = () => {
  const dispatch = useDispatch();

  const { jobs, status, error, page, jobsPerPage, statusFilter, searchQuery } =
    useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs({ statusFilter, searchQuery, page, jobsPerPage }));
  }, [dispatch, statusFilter, searchQuery, page, jobsPerPage]);

  // ✅ Extract jobs array from API response
  const jobList = Array.isArray(jobs?.jobs) ? jobs.jobs : [];

  // ✅ Remove duplicates
  const uniqueJobs = [...new Map(jobList.map((job) => [job.id, job])).values()];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-8 text-center">
        Featured Jobs
      </h2>

      {status === "loading" ? (
        <BarLoader className="mt-4 mx-auto" width="100%" color="#36d7b7" />
      ) : status === "failed" ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueJobs.length ? (
            uniqueJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="text-center text-gray-600 col-span-full">
              No Jobs Found 😢
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Featured;
