import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import IHireGroup from "../../../src/assets/MNTechs_logo.png";

const SidebarJobSuggest = () => {
  // Sample job data
  const jobs = [
    {
      id: 1,
      company: "TechCorp",
      logo: IHireGroup,
      title: "Frontend Developer",
      posted: "2 days ago",
      location: "Remote",
      reviews: 4.5,
      viewers: 120,
    },
    {
      id: 2,
      company: "Innovate Solutions",
      logo: IHireGroup,
      title: "Backend Engineer",
      posted: "1 week ago",
      location: "San Francisco, CA",
      reviews: 4.2,
      viewers: 85,
    },
    {
      id: 3,
      company: "DataWave",
      logo: IHireGroup,
      title: "Data Scientist",
      posted: "3 days ago",
      location: "New York, NY",
      reviews: 4.7,
      viewers: 200,
    },
  ];

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
          {jobs.slice(0, 2).map((job) => (
            <div
              key={job.id}
              className="bg-[#ffffff] border border-[#89b4d4]/20 rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-[#3b4f73]">
                    {job.title}
                  </h3>
                  <p className="text-xs font-medium text-[#000000]/80">
                    {job.company}
                  </p>
                </div>
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="h-10 w-10 rounded-md p-1 border border-[#89b4d4]/20 object-cover"
                />
              </div>
              <div className="mt-2 text-xs text-[#3b4f73]/80">
                <div className="flex items-center justify-start gap-1 mb-1">
                  <p>
                    <span className="font-medium text-[#3b4f73]">Posted:</span>{" "}
                    {job.posted}, 
                  </p>
                  <p>
                    <span className="font-medium text-[#3b4f73]">Viewers:</span>{" "}
                    {job.viewers}
                  </p>
                </div>
                <p>
                  <span className="font-medium text-[#3b4f73]">Location:</span>{" "}
                  {job.location}
                </p>
                <div className="flex items-center mt-1">
                  <span className="font-medium mr-1 text-[#3b4f73]">
                    Reviews:
                  </span>
                  <div className="flex">{renderStars(job.reviews)}</div>
                  <span className="ml-1 text-xs">({job.reviews})</span>
                </div>
              </div>
              <a
                href="#"
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
          {jobs.slice(2).map((job) => (
            <div
              key={job.id}
              className="bg-[#ffffff] border border-[#89b4d4]/20 rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-[#3b4f73]">
                    {job.title}
                  </h3>
                  <p className="text-xs font-medium text-[#000000]/80">
                    {job.company}
                  </p>
                </div>
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="h-10 w-10 rounded-md p-1 border border-[#89b4d4]/20 object-cover"
                />
              </div>
              <div className="mt-2 text-xs text-[#3b4f73]/80">
                <div className="flex items-center justify-start gap-1 mb-1">
                  <p>
                    <span className="font-medium text-[#3b4f73]">Posted:</span>{" "}
                    {job.posted}, 
                  </p>
                  <p>
                    <span className="font-medium text-[#3b4f73]">Viewers:</span>{" "}
                    {job.viewers}
                  </p>
                </div>
                <p>
                  <span className="font-medium text-[#3b4f73]">Location:</span>{" "}
                  {job.location}
                </p>
                <div className="flex items-center mt-1">
                  <span className="font-medium mr-1 text-[#3b4f73]">
                    Reviews:
                  </span>
                  <div className="flex">{renderStars(job.reviews)}</div>
                  <span className="ml-1 text-xs">({job.reviews})</span>
                </div>
              </div>
              <a
                href="#"
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
