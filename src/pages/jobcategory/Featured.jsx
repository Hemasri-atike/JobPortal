import { Bookmark, MapPin, Clock, DollarSign } from "lucide-react";

const Featured = () => {
  const jobs = [
    {
      id: 1,
      title: "Software Engineer (Android), Libraries",
      company: "Segment",
      logo: "S",
      logoColor: "bg-slate-700",
      location: "London, UK",
      timeAgo: "11 hours ago",
      salary: "$35k - $45k",
      type: "Full Time",
      status: "Private",
      urgent: true
    },
    {
      id: 2,
      title: "Recruiting Coordinator",
      company: "Catalyst",
      logo: "C",
      logoColor: "bg-purple-600",
      location: "London, UK",
      timeAgo: "11 hours ago",
      salary: "$35k - $45k",
      type: "Freelancer",
      status: "Private",
      urgent: true
    },
    {
      id: 3,
      title: "Product Manager, Studio",
      company: "Invision",
      logo: "in",
      logoColor: "bg-pink-500",
      location: "London, UK",
      timeAgo: "11 hours ago",
      salary: "$25k - $45k",
      type: "Part Time",
      status: "Private",
      urgent: true
    },
    {
      id: 4,
      title: "Senior Product Designer",
      company: "Upwork",
      logo: "up",
      logoColor: "bg-green-500",
      location: "London, UK",
      timeAgo: "11 hours ago",
      salary: "$35k - $45k",
      type: "Temporary",
      status: "Private",
      urgent: true
    },
    {
      id: 5,
      title: "Senior Full Stack Engineer, Creator Success",
      company: "Medium",
      logo: "M",
      logoColor: "bg-slate-900",
      location: "London, UK",
      timeAgo: "11 hours ago",
      salary: "$35k - $45k",
      type: "Full Time",
      status: "Private",
      urgent: true
    },
    {
      id: 6,
      title: "Software Engineer (Android), Libraries",
      company: "Figma",
      logo: "F",
      logoColor: "bg-blue-500",
      location: "London, UK",
      timeAgo: "11 hours ago",
      salary: "$35k - $45k",
      type: "Freelancer",
      status: "Private",
      urgent: true
    }
  ];

  const getTypeClasses = (type) => {
    switch (type) {
      case "Full Time":
        return "bg-blue-100 text-blue-700";
      case "Part Time":
        return "bg-yellow-100 text-yellow-700";
      case "Freelancer":
        return "bg-cyan-100 text-cyan-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
            Featured Jobs
          </h2>
          <p className="text-gray-500 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Know your worth and find the job that qualifies your life
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 max-w-7xl mx-auto">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 sm:p-6 border rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer hover:-translate-y-1 bg-white"
            >
              {/* Job Header */}
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-start space-x-3 sm:space-x-4 w-full sm:w-auto">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${job.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0`}
                  >
                    {job.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base lg:text-lg line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-1 sm:gap-2 lg:gap-4 text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                      <span className="flex items-center space-x-1">
                        <span>📍</span>
                        <span className="truncate">{job.company}</span>
                      </span>
                      <span className="hidden sm:flex items-center space-x-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">{job.location}</span>
                      </span>
                      <span className="hidden md:flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{job.timeAgo}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium">{job.salary}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bookmark Button */}
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-yellow-500 transition">
                  <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Job Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getTypeClasses(
                    job.type
                  )}`}
                >
                  {job.type}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs sm:text-sm font-medium">
                  {job.status}
                </span>
                {job.urgent && (
                  <span className="px-2 py-1 rounded-full bg-yellow-500 text-white text-xs sm:text-sm font-medium">
                    Urgent
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base transition">
            Load More Listings
          </button>
        </div>
      </div>
    </section>
  );
};

export default Featured;
