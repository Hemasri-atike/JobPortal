import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import JobCard from '../../components/ui/JobCard';

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

const Featured = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [company_id, setCompany_id] = useState('');
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Simulate API load
  useEffect(() => {
    setTimeout(() => {
      const mockCompanies = [
        { id: '1', name: 'TechCorp' },
        { id: '2', name: 'DataWorks' },
      ];
      const mockJobs = [
        {
          id: '1',
          title: 'Frontend Developer',
          company: 'TechCorp',
          location: 'Bangalore',
          skills: ['React', 'Tailwind', 'JavaScript'],
          description: 'Work on cutting-edge UI features with React and Tailwind CSS.',
        },
        {
          id: '2',
          title: 'Backend Developer',
          company: 'DataWorks',
          location: 'Mumbai',
          skills: ['Node.js', 'Express', 'MongoDB'],
          description: 'Build and maintain APIs with Node.js, Express, and MongoDB.',
        },
      ];
      setCompanies(mockCompanies);
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    setSearchQuery(formData.get('search-query'));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCompany_id('');
    setLocation('');
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      (searchQuery
        ? job.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true) &&
      (location ? job.location === location : true) &&
      (company_id
        ? job.company === companies.find((c) => c.id === company_id)?.name
        : true)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-8 text-center">
        Featured Jobs
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
          <Button type="submit" className="h-12 w-full sm:w-32">
            Search
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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

      {loading ? (
        <BarLoader className="mt-4 mx-auto" width="100%" color="#36d7b7" />
      ) : (
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.length ? (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} savedInit={false} />)
          ) : (
            <div className="text-center text-gray-600 col-span-full">No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Featured;