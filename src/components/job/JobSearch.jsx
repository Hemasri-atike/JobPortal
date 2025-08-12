import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import {
  Search,
  ChevronDown,
  MapPin,
  Briefcase,
  Zap,
  Calendar,
  Building2,
  UserCheck,
  Code,
  Globe,
  Building,
  Users,
} from 'lucide-react';
import Header from '../../pages/navbar/Header';
import JobCard from '../../components/ui/JobCard';
import Footer from "../../pages/footer/Footer"

// Mock data for jobs and companies
const mockJobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Hyderabad',
    salaryMin: 500000,
    salaryMax: 800000,
    jobType: 'Full Time',
    experienceLevel: '3-5 years',
    skills: ['React', 'JavaScript', 'CSS'],
    workMode: 'Hybrid',
    postedDate: '2025-08-01',
    isOpen: true,
    applications: [{ id: 'app1' }],
    description: 'Build and maintain web applications using React.',
    requirements: 'Experience with React, TypeScript, and modern frontend tools.',
    benefits: ['Health Insurance', 'Flexible Hours'],
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'DataWorks',
    location: 'Bangalore',
    salaryMin: 600000,
    salaryMax: 900000,
    jobType: 'Full Time',
    experienceLevel: '5+ years',
    skills: ['Node.js', 'MongoDB'],
    workMode: 'Remote',
    postedDate: '2025-07-20',
    isOpen: false,
    applications: [],
    description: 'Develop scalable backend systems.',
    requirements: 'Strong knowledge of Node.js and databases.',
    benefits: ['Stock Options', 'Remote Work'],
  },
];

const mockCompanies = [
  { id: '1', name: 'TechCorp', logo_url: 'https://via.placeholder.com/48' },
  { id: '2', name: 'DataWorks', logo_url: 'https://via.placeholder.com/48' },
  { id: '3', name: 'CreativeLabs', logo_url: 'https://via.placeholder.com/48' },
  { id: '4', name: 'AIInnovate', logo_url: 'https://via.placeholder.com/48' },
];

// Custom Button and Input components
const Button = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const JobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [company_id, setCompany_id] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    jobRole: '',
    salary: '',
    jobType: '',
    experience: '',
    postedDate: '',
    skills: '',
    workMode: '',
    companyName: '',
    vacancies: '',
  });
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Simulate API load
  useEffect(() => {
    setTimeout(() => {
      setCompanies(mockCompanies);
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    setSearchQuery(formData.get('search-query'));
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setCompany_id('');
    setFilters({
      city: '',
      jobRole: '',
      salary: '',
      jobType: '',
      experience: '',
      postedDate: '',
      skills: '',
      workMode: '',
      companyName: '',
      vacancies: '',
    });
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = searchQuery
      ? job.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesLocation = locationFilter ? job.location === locationFilter : true;
    const matchesCompany = company_id
      ? job.company === companies.find((c) => c.id === company_id)?.name
      : true;
    const matchesCity = filters.city
      ? job.location.toLowerCase().includes(filters.city.toLowerCase())
      : true;
    const matchesJobRole = filters.jobRole
      ? job.title.toLowerCase().includes(filters.jobRole.toLowerCase())
      : true;
    const matchesJobType = filters.jobType ? job.jobType === filters.jobType : true;
    const matchesExperience = filters.experience
      ? job.experienceLevel === filters.experience
      : true;
    const matchesSkills = filters.skills
      ? job.skills?.some((skill) =>
          filters.skills
            .toLowerCase()
            .split(',')
            .map((s) => s.trim())
            .includes(skill.toLowerCase())
        )
      : true;
    const matchesWorkMode = filters.workMode ? job.workMode === filters.workMode : true;
    const matchesCompanyName = filters.companyName
      ? job.company.toLowerCase().includes(filters.companyName.toLowerCase())
      : true;
    const matchesVacancies = filters.vacancies
      ? job.vacancies >= parseInt(filters.vacancies)
      : true;
    const matchesSalary = filters.salary
      ? job.salaryMin >= parseInt(filters.salary.replace(/[^0-9]/g, ''))
      : true;
    const matchesPostedDate = filters.postedDate
      ? new Date(job.postedDate) >=
        new Date(
          Date.now() - parseInt(filters.postedDate.replace(/[^0-9]/g, '')) * 24 * 60 * 60 * 1000
        )
      : true;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCompany &&
      matchesCity &&
      matchesJobRole &&
      matchesJobType &&
      matchesExperience &&
      matchesSkills &&
      matchesWorkMode &&
      matchesCompanyName &&
      matchesVacancies &&
      matchesSalary &&
      matchesPostedDate
    );
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-8 text-center">
            Find Your Dream Job
          </h2>

          {/* Centered Search and Filter Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center mb-4">
              <Input
                type="text"
                placeholder="Search Jobs by Title..."
                name="search-query"
                className="flex-1 h-12 text-md"
              />
              <Button type="submit" className="h-12 w-full sm:w-32 flex items-center justify-center">
                <Search size={18} className="mr-1" /> Search
              </Button>
            </form>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full sm:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Filter by Location</option>
                {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad'].map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <select
                value={company_id}
                onChange={(e) => setCompany_id(e.target.value)}
                className="w-full sm:w-1/3 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Filter by Company</option>
                {companies.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                className="w-full sm:w-auto px-4 py-2 text-sm bg-red-600 hover:bg-red-700"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <aside className="bg-white p-4 rounded-md shadow-sm lg:col-span-1">
              <h2 className="text-lg font-semibold flex items-center text-teal-600 mb-4">
                <FilterIcon size={20} className="mr-2" /> Filters{' '}
                <span className="ml-2 text-sm text-gray-500">
                  ({Object.values(filters).filter((f) => f).length +
                    (searchQuery ? 1 : 0) +
                    (locationFilter ? 1 : 0) +
                    (company_id ? 1 : 0)})
                </span>
              </h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['New Jobs', 'Within 10 KMs', 'Work from home', 'Field job', 'Top Company'].map(
                    (filter) => (
                      <span
                        key={filter}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200 flex items-center gap-1"
                      >
                        <Zap size={14} /> {filter}
                      </span>
                    )
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <MapPin size={14} className="inline-block mr-1" /> City
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Briefcase size={14} className="inline-block mr-1" /> Job Role
                  </label>
                  <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-orange-50 text-sm cursor-pointer">
                    {filters.jobRole || 'Select Job Role'}
                    <ChevronDown size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Building2 size={14} className="inline-block mr-1" /> Job Type
                  </label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <UserCheck size={14} className="inline-block mr-1" /> Experience
                  </label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Calendar size={14} className="inline-block mr-1" /> Posted Date
                  </label>
                  <select
                    value={filters.postedDate}
                    onChange={(e) => setFilters({ ...filters, postedDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Any time</option>
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 14 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Code size={14} className="inline-block mr-1" /> Skills
                  </label>
                  <input
                    type="text"
                    value={filters.skills}
                    onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                    placeholder="e.g. React, Node.js"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Globe size={14} className="inline-block mr-1" /> Work Mode
                  </label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Building size={14} className="inline-block mr-1" /> Company Name
                  </label>
                  <input
                    type="text"
                    value={filters.companyName}
                    onChange={(e) => setFilters({ ...filters, companyName: e.target.value })}
                    placeholder="e.g. Google"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Users size={14} className="inline-block mr-1" /> Number of Vacancies
                  </label>
                  <input
                    type="number"
                    value={filters.vacancies}
                    onChange={(e) => setFilters({ ...filters, vacancies: e.target.value })}
                    placeholder="e.g. 5"
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">💰 Salary</label>
                  <div className="space-y-2 mt-1">
                    {['More than ₹ 5000', 'More than ₹ 10000', 'More than ₹ 20000'].map(
                      (option) => (
                        <label key={option} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="salary"
                            value={option}
                            onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          {option}
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Job List */}
            <main className="lg:col-span-3 space-y-4">
              <div className="bg-yellow-50 p-3 rounded-md text-sm flex flex-wrap gap-3">
                <span className="font-semibold flex items-center gap-1">
                  ⭐ Top match jobs for you
                </span>
                <span>📍 Near you</span>
                <span>💰 Good salary</span>
                <span>✅ Matching experience</span>
              </div>

              {loading ? (
                <BarLoader className="mt-4 mx-auto" width="100%" color="#36d7b7" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))
                  ) : (
                    <div className="text-center text-gray-600 col-span-full">No Jobs Found 😢</div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

// Placeholder FilterIcon
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