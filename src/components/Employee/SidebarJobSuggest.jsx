import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaRegStar } from "react-icons/fa";
import { fetchJobs } from "../../store/jobsSlice"; // Adjust path as needed
import IHireGroup from "../../../src/assets/MNTechs_logo.png";

const SidebarJobSuggest = ({ category = "" }) => {
  const dispatch = useDispatch();
  const { jobs, jobsStatus, jobsError } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (category) {
      dispatch(
        fetchJobs({
          category,
          page: 1,
          jobsPerPage: 5,
          statusFilter: "Active",
        })
      );
    }
  }, [dispatch, category]);

  
  // Use real jobs if available and successful, else fallback
  const displayJobs = jobsStatus === "succeeded" && jobs.length > 0
    ? jobs.map((job) => ({
        ...job,
        rating: job.rating || 4.2, // Default rating if not available
        logo: IHireGroup, // Default logo
      }))
    : sampleJobs;

  if (jobsStatus === "loading" && !category) {
    return (
      <aside className="bg-[#ffffff] text-[#3b4f73] border border-[#89b4d4]/30 w-full lg:w-80 xl:w-96 h-full lg:h-auto lg:sticky lg:top-4 p-5 rounded-2xl shadow-sm">
        <p>Loading similar jobs...</p>
      </aside>
    );
  }

  if (jobsError && !category) {
    return (
      <aside className="bg-[#ffffff] text-[#3b4f73] border border-[#89b4d4]/30 w-full lg:w-80 xl:w-96 h-full lg:h-auto lg:sticky lg:top-4 p-5 rounded-2xl shadow-sm">
        <p>Error loading jobs: {jobsError}</p>
      </aside>
    );
  }

  // Relative time function
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const jobDate = new Date(dateString);
    const diffInDays = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24));
    if (diffInDays < 1) return "Today";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  };

  // Star rating component
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.floor(rating) ? (
          <FaStar key={i} className="h-4 w-4 text-[#89b4d4]" />
        ) : (
          <FaRegStar key={i} className="h-4 w-4 text-[#3b4f73]/30" />
        )
      );
    }
    return stars;
  };

  return (
    <aside className="bg-[#ffffff] text-[#3b4f73] border border-[#89b4d4]/30 w-full lg:w-80 xl:w-96 h-full lg:h-auto lg:sticky lg:top-4 p-5 rounded-2xl shadow-sm">
      {/* Similar Jobs Section */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-[#3b4f73] mb-3 tracking-tight">
          Similar Jobs
        </h2>
        <div className="space-y-4">
          {displayJobs.slice(0, 2).map((job) => (
            <div
              key={job.id}
              className="bg-[#ffffff] border border-[#89b4d4]/20 rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-[#3b4f73]">
                    {job.title}
                  </h3>
                  <p className="text-xs font-medium text-[#000000]/80">
                    {job.company_name}
                  </p>
                </div>
                <img
                  src={job.logo || IHireGroup}
                  alt={`${job.company_name} logo`}
                  className="h-10 w-10 rounded-md p-1 border border-[#89b4d4]/20 object-cover"
                />
              </div>
              <div className="mt-2 text-xs text-[#3b4f73]/80">
                <div className="flex items-center justify-start gap-1 mb-1">
                  <p>
                    <span className="font-medium text-[#3b4f73]">Posted:</span>{" "}
                    {getRelativeTime(job.created_at || job.createdAt)}, 
                  </p>
                  <p>
                    <span className="font-medium text-[#3b4f73]">Viewers:</span>{" "}
                    {job.views || job.viewers || 0}
                  </p>
                </div>
                <p>
                  <span className="font-medium text-[#3b4f73]">Location:</span>{" "}
                  {job.city}, {job.state || "N/A"}
                </p>
                <div className="flex items-center mt-1">
                  <span className="font-medium mr-1 text-[#3b4f73]">
                    Reviews:
                  </span>
                  <div className="flex">{renderStars(job.rating)}</div>
                  <span className="ml-1 text-xs">({job.rating})</span>
                </div>
              </div>
              <a
                href={`/job/${job.id}`}
                className="mt-2 inline-block text-xs font-medium text-[#3b4f73] bg-[#89b4d4]/10 px-3 py-1 rounded-full hover:bg-[#89b4d4] hover:text-[#ffffff] transition-all duration-300"
              >
                View Job
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Interested Jobs Section */}
      <section>
        <h2 className="text-lg font-semibold text-[#3b4f73] mb-3 tracking-tight">
          Interested Jobs
        </h2>
        <div className="space-y-4">
          {displayJobs.slice(2).map((job) => (
            <div
              key={job.id}
              className="bg-[#ffffff] border border-[#89b4d4]/20 rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-[#3b4f73]">
                    {job.title}
                  </h3>
                  <p className="text-xs font-medium text-[#000000]/80">
                    {job.company_name}
                  </p>
                </div>
                <img
                  src={job.logo || IHireGroup}
                  alt={`${job.company_name} logo`}
                  className="h-10 w-10 rounded-md p-1 border border-[#89b4d4]/20 object-cover"
                />
              </div>
              <div className="mt-2 text-xs text-[#3b4f73]/80">
                <div className="flex items-center justify-start gap-1 mb-1">
                  <p>
                    <span className="font-medium text-[#3b4f73]">Posted:</span>{" "}
                    {getRelativeTime(job.created_at || job.createdAt)}, 
                  </p>
                  <p>
                    <span className="font-medium text-[#3b4f73]">Viewers:</span>{" "}
                    {job.views || job.viewers || 0}
                  </p>
                </div>
                <p>
                  <span className="font-medium text-[#3b4f73]">Location:</span>{" "}
                  {job.city}, {job.state || "N/A"}
                </p>
                <div className="flex items-center mt-1">
                  <span className="font-medium mr-1 text-[#3b4f73]">
                    Reviews:
                  </span>
                  <div className="flex">{renderStars(job.rating)}</div>
                  <span className="ml-1 text-xs">({job.rating})</span>
                </div>
              </div>
              <a
                href={`/job/${job.id}`}
                className="mt-2 inline-block text-xs font-medium text-[#3b4f73] bg-[#89b4d4]/10 px-3 py-1 rounded-full hover:bg-[#89b4d4] hover:text-[#ffffff] transition-all duration-300"
              >
                View Job
              </a>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default SidebarJobSuggest;