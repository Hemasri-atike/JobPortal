import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../pages/navbar/Header";
import JobCard from "../../components/ui/JobCard";
import Footer from "../../pages/footer/Footer";
import { BarLoader } from "react-spinners";
import { Search } from "lucide-react";
import statesWithCities from "../common/Statesncities";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    jobRole: "",
    salary: "",
    jobType: "",
    experience: "",
    postedDate: "",
    skills: "",
    workMode: "",
    companyName: "",
    vacancies: "",
  });
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Fetch jobs + companies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          axios.get("/api/jobs"),
          axios.get("/api/companies"),
        ]);
        setJobs(Array.isArray(jobsRes.data?.data) ? jobsRes.data.data : []);
        setCompanies(
          Array.isArray(companiesRes.data?.data) ? companiesRes.data.data : []
        );
      } catch (err) {
        console.error("Error fetching jobs/companies:", err);
        setJobs([]);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const title = job?.title?.toLowerCase() || "";
    const location = job?.location?.toLowerCase() || "";
    const jobType = job?.jobType || "";
    const expLevel = job?.experienceLevel || "";
    const workMode = job?.workMode || "";
    const company = job?.company?.toLowerCase() || "";
    const skills = Array.isArray(job?.skills)
      ? job.skills.map((s) => s.toLowerCase())
      : [];

    const matchesSearch = searchQuery
      ? title.includes(searchQuery.toLowerCase())
      : true;
    const matchesState = filters.state
      ? location.includes(filters.state.toLowerCase())
      : true;
    const matchesCity = filters.city
      ? location.includes(filters.city.toLowerCase())
      : true;
    const matchesJobRole = filters.jobRole
      ? title.includes(filters.jobRole.toLowerCase())
      : true;
    const matchesJobType = filters.jobType
      ? jobType === filters.jobType
      : true;
    const matchesExperience = filters.experience
      ? expLevel === filters.experience
      : true;
    const matchesSkills = filters.skills
      ? filters.skills
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .some((skill) => skills.includes(skill))
      : true;
    const matchesWorkMode = filters.workMode
      ? workMode === filters.workMode
      : true;
    const matchesCompanyName = filters.companyName
      ? company.includes(filters.companyName.toLowerCase())
      : true;
    const matchesSalary = filters.salary
      ? Number(job.salaryMin || 0) >=
        parseInt(filters.salary.replace(/[^0-9]/g, ""), 10)
      : true;
    const matchesPostedDate =
      filters.postedDate && job.postedDate
        ? new Date(job.postedDate) >=
          new Date(
            Date.now() -
              parseInt(filters.postedDate.replace(/[^0-9]/g, ""), 10) *
                24 *
                60 *
                60 *
                1000
          )
        : true;

    return (
      matchesSearch &&
      matchesState &&
      matchesCity &&
      matchesJobRole &&
      matchesJobType &&
      matchesExperience &&
      matchesSkills &&
      matchesWorkMode &&
      matchesCompanyName &&
      matchesSalary &&
      matchesPostedDate
    );
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
            Find Your Dream Job
          </h2>

          {/* Search Box */}
          <form className="flex flex-col sm:flex-row gap-3 items-center mb-6">
            <input
              type="text"
              placeholder="Search Jobs by Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-12 border rounded-md px-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="h-12 w-full sm:w-32 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              <Search size={18} className="mr-1" /> Search
            </button>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="bg-white p-4 rounded-md shadow-sm lg:col-span-1 space-y-4">
              <FilterSection
                filters={filters}
                setFilters={setFilters}
                companies={companies}
                citySearch={citySearch}
                setCitySearch={setCitySearch}
                showCityDropdown={showCityDropdown}
                setShowCityDropdown={setShowCityDropdown}
              />
            </aside>

            {/* Job List */}
            <main className="lg:col-span-3 space-y-4">
              {loading ? (
                <BarLoader
                  className="mt-4 mx-auto"
                  width="100%"
                  color="#36d7b7"
                />
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

// Sidebar
const FilterSection = ({
  filters,
  setFilters,
  companies,
  citySearch,
  setCitySearch,
  showCityDropdown,
  setShowCityDropdown,
}) => {
  const handleCitySelect = (city) => {
    setFilters({ ...filters, city });
    setCitySearch(city);
    setShowCityDropdown(false);
  };

  return (
    <>
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
            <option key={state} value={state}>
              {state}
            </option>
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

        {/* Dropdown */}
        {filters.state && showCityDropdown && (
          <ul className="absolute z-50 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg">
            {statesWithCities[filters.state]
              .filter((city) =>
                city.toLowerCase().includes(citySearch.toLowerCase())
              )
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
        <select
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          <option>Full Time</option>
          <option>Part Time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
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

      {/* Work Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Work Mode</label>
        <select
          value={filters.workMode}
          onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          <option>Remote</option>
          <option>On-site</option>
          <option>Hybrid</option>
        </select>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Company</label>
        <select
          value={filters.companyName}
          onChange={(e) =>
            setFilters({ ...filters, companyName: e.target.value })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c.id || c._id} value={c.name}>
              {c.name}
            </option>
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
            jobType: "",
            experience: "",
            postedDate: "",
            skills: "",
            workMode: "",
            companyName: "",
            vacancies: "",
          });
          setCitySearch("");
          setShowCityDropdown(false);
        }}
        className="mt-4 w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 text-sm"
      >
        Clear Filters
      </button>
    </>
  );
};

export default JobSearch;
