import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  Briefcase,
  Zap,
  Calendar,
  Clock,
  Building2,
  UserCheck,
  Code,
  Globe,
  Building,
  Users,
} from "lucide-react";
import Header from "../../pages/navbar/Header";

const jobData = [
  {
    id: 1,
    title: "Computer Operator",
    salary: "₹ 24,000 - 40,000 /month",
    company: "A R Ayurveda Private Limited",
    location: "Work from home (within 4KM)",
    tags: ["New", "10 Vacancies", "High Demand"],
    topMatch: true,
    benefits: ["PF provided", "Work from Home", "Health Insurance"],
  },
  // Add more job objects here
];

const JobSearch = () => {
  const [filters, setFilters] = useState({
    city: "Hyderabad",
    jobRole: "IT / Hardware / Network Engineer",
    salary: "",
    jobType: "",
    experience: "",
    postedDate: "",
    skills: "",
    workMode: "",
    companyName: "",
    vacancies: "",
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="bg-white p-4 rounded-md shadow-sm lg:col-span-1">
            <h2 className="text-lg font-semibold flex items-center text-teal-600 mb-4">
              <FilterIcon size={20} className="mr-2" /> Filters{" "}
              <span className="ml-2 text-sm text-gray-500">(9)</span>
            </h2>

            <div className="space-y-4">
              {/* Quick filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  "New Jobs",
                  "Within 10 KMs",
                  "Work from home",
                  "Field job",
                  "Top Company",
                ].map((filter) => (
                  <span
                    key={filter}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200 flex items-center gap-1"
                  >
                    <Zap size={14} /> {filter}
                  </span>
                ))}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <MapPin size={14} className="inline-block mr-1" /> City
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Job Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Briefcase size={14} className="inline-block mr-1" /> Job Role
                </label>
                <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-orange-50 text-sm cursor-pointer">
                  {filters.jobRole}
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Building2 size={14} className="inline-block mr-1" /> Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) =>
                    setFilters({ ...filters, jobType: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <UserCheck size={14} className="inline-block mr-1" /> Experience
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) =>
                    setFilters({ ...filters, experience: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option>Fresher</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>

              {/* Posted Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar size={14} className="inline-block mr-1" /> Posted Date
                </label>
                <select
                  value={filters.postedDate}
                  onChange={(e) =>
                    setFilters({ ...filters, postedDate: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Any time</option>
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 14 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Code size={14} className="inline-block mr-1" /> Skills
                </label>
                <input
                  type="text"
                  value={filters.skills}
                  onChange={(e) =>
                    setFilters({ ...filters, skills: e.target.value })
                  }
                  placeholder="e.g. React, Node.js"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Globe size={14} className="inline-block mr-1" /> Work Mode
                </label>
                <select
                  value={filters.workMode}
                  onChange={(e) =>
                    setFilters({ ...filters, workMode: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Building size={14} className="inline-block mr-1" /> Company Name
                </label>
                <input
                  type="text"
                  value={filters.companyName}
                  onChange={(e) =>
                    setFilters({ ...filters, companyName: e.target.value })
                  }
                  placeholder="e.g. Google"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Number of Vacancies */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Users size={14} className="inline-block mr-1" /> Number of Vacancies
                </label>
                <input
                  type="number"
                  value={filters.vacancies}
                  onChange={(e) =>
                    setFilters({ ...filters, vacancies: e.target.value })
                  }
                  placeholder="e.g. 5"
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  💰 Salary
                </label>
                <div className="space-y-2 mt-1">
                  {[
                    "More than ₹ 5000",
                    "More than ₹ 10000",
                    "More than ₹ 20000",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="salary"
                        value={option}
                        onChange={(e) =>
                          setFilters({ ...filters, salary: e.target.value })
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job List */}
          <main className="lg:col-span-3 space-y-4">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Search jobs here"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-md flex items-center justify-center">
                <Search size={18} className="mr-1" /> Search
              </button>
            </div>

            {/* Top match banner */}
            <div className="bg-yellow-50 p-3 rounded-md text-sm flex flex-wrap gap-3">
              <span className="font-semibold flex items-center gap-1">
                ⭐ Top match jobs for you
              </span>
              <span>📍 Near you</span>
              <span>💰 Good salary</span>
              <span>✅ Matching experience</span>
            </div>

            {/* Job cards */}
            {jobData.map((job) => (
              <div
                key={job.id}
                className="bg-white p-4 rounded-md shadow-sm border border-gray-100"
              >
                {job.topMatch && (
                  <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-md">
                    Top Match
                  </span>
                )}
                <h3 className="text-lg font-semibold mt-2">{job.title}</h3>
                <p className="text-gray-700 text-sm">{job.salary}</p>
                <p className="text-gray-500 text-sm">{job.company}</p>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin size={14} className="mr-1" /> {job.location}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 rounded-md text-xs flex items-center gap-1"
                    >
                      {tag === "High Demand" && <Zap size={12} />}
                      {tag}
                    </span>
                  ))}
                </div>
                {job.benefits.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {job.benefits.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </main>
        </div>
      </div>
    </>
  );
};

// Placeholder for FilterIcon since it's not defined in the original code
const FilterIcon = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 3H2l8 9.46V19a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-6.54L22 3z" />
  </svg>
);

export default JobSearch;