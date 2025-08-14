import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Mail, Download } from 'lucide-react';
import Header from '../../navbar/Header';
import Sidebar from '../layout/Sidebar';

const Applied = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const jobsPerPage = 4;

  // Mock data (replace with API call)
  const mockJobs = [
    {
      id: 1,
      title: 'Software Engineer (Android), Libraries',
      company: 'Segment',
      logo: '/logos/segment.png',
      location: 'London, UK',
      appliedDate: '2025-08-10',
      salary: '$35k - $45k',
      status: 'Under Review',
      tags: ['Full Time', 'Private', 'Urgent'],
      recruiterActions: { invitationSent: true, resumeDownloaded: true },
    },
    {
      id: 2,
      title: 'Recruiting Coordinator',
      company: 'Catalyst',
      logo: '/logos/catalyst.png',
      location: 'London, UK',
      appliedDate: '2025-08-09',
      salary: '$35k - $45k',
      status: 'Shortlisted',
      tags: ['Freelancer', 'Private', 'Urgent'],
      recruiterActions: { invitationSent: false, resumeDownloaded: true },
    },
    {
      id: 3,
      title: 'Product Manager, Studio',
      company: 'Invision',
      logo: '/logos/invision.png',
      location: 'London, UK',
      appliedDate: '2025-08-08',
      salary: '$35k - $45k',
      status: 'Interview Scheduled',
      tags: ['Part Time', 'Private', 'Urgent'],
      recruiterActions: { invitationSent: true, resumeDownloaded: false },
    },
    {
      id: 4,
      title: 'Senior Product Designer',
      company: 'Upwork',
      logo: '/logos/upwork.png',
      location: 'London, UK',
      appliedDate: '2025-08-07',
      salary: '$35k - $45k',
      status: 'Applied',
      tags: ['Temporary', 'Private', 'Urgent'],
      recruiterActions: { invitationSent: false, resumeDownloaded: false },
    },
  ];

  // Simulate API fetch
  useEffect(() => {
    setIsLoading(true);
    // Replace with actual API call, e.g., axios.get('/api/candidate/applied-jobs')
    setTimeout(() => {
      setJobs(mockJobs);
      setIsLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  // Filter jobs by status and search query
  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Paginate jobs
  const paginatedJobs = filteredJobs.slice(0, page * jobsPerPage);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - collapses on small screens */}
        <div className="hidden md:block w-64 bg-gray-100">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Applied Jobs</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by job title or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    aria-label="Search applied jobs"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  aria-label="Filter by application status"
                >
                  <option value="All">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                </select>
                {(searchQuery || statusFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Applied Jobs List */}
              {paginatedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow p-5 flex flex-col">
                      <div className="flex items-center mb-4">
                        <img src={job.logo} alt={job.company} className="w-12 h-12 rounded" />
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{job.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                            <span>{job.company}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>Applied {job.appliedDate}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            💰 {job.salary}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {job.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`px-3 py-1 text-xs rounded-full ${
                                  tag === 'Full Time'
                                    ? 'bg-blue-100 text-blue-600'
                                    : tag === 'Freelancer'
                                    ? 'bg-purple-100 text-purple-600'
                                    : tag === 'Part Time'
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : tag === 'Temporary'
                                    ? 'bg-pink-100 text-pink-600'
                                    : 'bg-green-100 text-green-600'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Status: </span>{job.status}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Recruiter Actions: </span>
                        {job.recruiterActions.invitationSent && (
                          <span className="text-green-600">
                            <Mail size={14} className="inline mr-1" /> Invitation Sent
                          </span>
                        )}
                        {job.recruiterActions.resumeDownloaded && (
                          <span className="text-yellow-600 ml-2">
                            <Download size={14} className="inline mr-1" /> Resume Downloaded
                          </span>
                        )}
                        {!job.recruiterActions.invitationSent && !job.recruiterActions.resumeDownloaded && (
                          <span>No actions yet</span>
                        )}
                      </div>
                      <Link
                        to={`/job/${job.id}`}
                        className="mt-2 text-blue-600 hover:underline text-sm flex items-center"
                        aria-label={`View details for ${job.title}`}
                      >
                        View Details <ChevronRight size={16} className="inline ml-1" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center">No applied jobs match your filters.</p>
              )}

              {/* Load More Button */}
              {filteredJobs.length > paginatedJobs.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setPage(page + 1)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    aria-label="Load more applied jobs"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Applied;