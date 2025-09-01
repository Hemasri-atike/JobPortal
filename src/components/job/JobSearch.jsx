// src/pages/jobs/JobSearch.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, fetchCategories } from "../../store/jobsSlice";
import Header from "../../pages/navbar/Header";
import Footer from "../../pages/footer/Footer";
import JobCard from "../../components/ui/JobCard";
import { BarLoader } from "react-spinners";
import { Search } from "lucide-react";
import statesWithCities from "../common/Statesncities";

const JobSearch = () => {
  const dispatch = useDispatch();

const {
  jobs: jobsArray,
  status,
  total,
  searchQuery,
  location,
  page,
  jobsPerPage,
} = useSelector((state) => state.jobs);

const jobs = Array.isArray(jobsArray) ? jobsArray : [];


  // ✅ Ensure jobs is always an array


  const [filters, setFilters] = useState({
    state: "",
    city: "",
    jobRole: "",
    salary: "",
    jobType: [],
    experience: "",
    postedDate: "",
    skills: [],
    workMode: [],
    companyName: "",
    vacancies: "",
  });

  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Fetch jobs initially & when filters/search/page changes
  useEffect(() => {
    dispatch(
      fetchJobs({
        statusFilter: "All",
        searchQuery: searchInput,
        location: filters.city || filters.state || "",
        page,
        jobsPerPage,
      })
    );
  }, [dispatch, filters, searchInput, page, jobsPerPage]);

  // Fetch categories (if needed)
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter jobs locally for skills, workMode, jobType arrays
  const filteredJobs = jobsArray.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const loc = job.location?.toLowerCase() || "";
    const company = job.company?.toLowerCase() || "";
    const skills = Array.isArray(job.skills)
      ? job.skills.map((s) => s.toLowerCase())
      : [];

    const matchesSearch = searchInput
      ? title.includes(searchInput.toLowerCase())
      : true;

    const matchesState = filters.state
      ? loc.includes(filters.state.toLowerCase())
      : true;

    const matchesCity = filters.city
      ? loc.includes(filters.city.toLowerCase())
      : true;

    const matchesJobRole = filters.jobRole
      ? title.includes(filters.jobRole.toLowerCase())
      : true;

    const matchesJobType =
      filters.jobType.length > 0 ? filters.jobType.includes(job.jobType) : true;

    const matchesWorkMode =
      filters.workMode.length > 0 ? filters.workMode.includes(job.workMode) : true;

    const matchesSkills =
      filters.skills.length > 0
        ? filters.skills.some((skill) => skills.includes(skill.toLowerCase()))
        : true;

    const matchesCompanyName = filters.companyName
      ? company.includes(filters.companyName.toLowerCase())
      : true;

    const matchesExperience = filters.experience
      ? job.experienceLevel === filters.experience
      : true;

    const matchesSalary = filters.salary
      ? Number(job.salaryMin || 0) >= Number(filters.salary)
      : true;

    const matchesPostedDate =
      filters.postedDate && job.postedDate
        ? new Date(job.postedDate) >=
          new Date(
            Date.now() - Number(filters.postedDate) * 24 * 60 * 60 * 1000
          )
        : true;

    return (
      matchesSearch &&
      matchesState &&
      matchesCity &&
      matchesJobRole &&
      matchesJobType &&
      matchesWorkMode &&
      matchesSkills &&
      matchesCompanyName &&
      matchesExperience &&
      matchesSalary &&
      matchesPostedDate
    );
  });

  // Handle city select
  const handleCitySelect = (city) => {
    setFilters({ ...filters, city });
    setCitySearch(city);
    setShowCityDropdown(false);
  };

  // Checkbox toggle for jobType, skills, workMode
  const toggleCheckbox = (key, value) => {
    const current = Array.isArray(filters[key]) ? filters[key] : [];
    if (current.includes(value)) {
      setFilters({ ...filters, [key]: current.filter((v) => v !== value) });
    } else {
      setFilters({ ...filters, [key]: [...current, value] });
    }
  };

  const jobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Work From Home"];
  const workModes = ["Remote", "On-site", "Hybrid"];
  const skillsList = ["React", "Node.js", "JavaScript", "Python", "Java", "SQL"];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
            Find Your Dream Job
          </h2>

          {/* Search */}
          <form className="flex flex-col sm:flex-row gap-3 items-center mb-6">
            <input
              type="text"
              placeholder="Search Jobs by Title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 h-12 border rounded-md px-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => {}}
              className="h-12 w-full sm:w-32 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              <Search size={18} className="mr-1" /> Search
            </button>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="bg-white p-4 rounded-md shadow-sm lg:col-span-1 space-y-4">
              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => {
                    setFilters({ ...filters, state: e.target.value, city: "" });
                    setCitySearch("");
                    setShowCityDropdown(false);
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select State</option>
                  {Object.keys(statesWithCities).map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={citySearch}
                  onFocus={() => setShowCityDropdown(true)}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  disabled={!filters.state}
                  placeholder={!filters.state ? "Select state first" : "Search city..."}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
                />
                {filters.state && showCityDropdown && (
                  <ul className="absolute z-50 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg">
                    {statesWithCities[filters.state]
                      .filter((city) => city.toLowerCase().includes(citySearch.toLowerCase()))
                      .map((city) => (
                        <li
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                        >
                          {city}
                        </li>
                      ))}
                    {statesWithCities[filters.state].filter((city) =>
                      city.toLowerCase().includes(citySearch.toLowerCase())
                    ).length === 0 && (
                      <li className="px-3 py-2 text-gray-500 text-sm">No cities found</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                <div className="mt-1 space-y-1">
                  {jobTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => toggleCheckbox("jobType", type)}
                        className="h-4 w-4 border-gray-300 rounded"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Mode</label>
                <div className="mt-1 space-y-1">
                  {workModes.map((mode) => (
                    <label key={mode} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.workMode.includes(mode)}
                        onChange={() => toggleCheckbox("workMode", mode)}
                        className="h-4 w-4 border-gray-300 rounded"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                <div className="mt-1 space-y-1 max-h-36 overflow-y-auto">
                  {skillsList.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.skills.includes(skill)}
                        onChange={() => toggleCheckbox("skills", skill)}
                        className="h-4 w-4 border-gray-300 rounded"
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select</option>
                  <option>Fresher</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Salary</label>
                <input
                  type="number"
                  value={filters.salary || ""}
                  onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
                  placeholder="Enter salary in ₹"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Posted Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Posted Date</label>
                <select
                  value={filters.postedDate || ""}
                  onChange={(e) => setFilters({ ...filters, postedDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Anytime</option>
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <select
                  value={filters.companyName}
                  onChange={(e) => setFilters({ ...filters, companyName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select Company</option>
                  {jobsArray.map((c) => (
                    <option key={c.id || c._id} value={c.company}>{c.company}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    state: "",
                    city: "",
                    jobRole: "",
                    salary: "",
                    jobType: [],
                    experience: "",
                    postedDate: "",
                    skills: [],
                    workMode: [],
                    companyName: "",
                    vacancies: "",
                  });
                  setCitySearch("");
                  setShowCityDropdown(false);
                  setSearchInput("");
                }}
                className="mt-4 w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 text-sm"
              >
                Clear Filters
              </button>
            </aside>

            {/* Job List */}
            <main className="lg:col-span-3 space-y-4">
              {status === "loading" ? (
                <BarLoader className="mt-4 mx-auto" width="100%" color="#36d7b7" />
              ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id || job._id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600 col-span-full">
                  No Jobs Found 😢
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobSearch;
