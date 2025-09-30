import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Mail, Download, Filter } from 'lucide-react';
import Header from '../../navbar/Header';
import Sidebar from '../layout/Sidebar';
import { logoutUser } from '../../../store/userSlice';
import { fetchAppliedJobs } from '../../../store/jobsSlice';

const Applied = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const candidateId = useSelector((state) => state.user.userInfo?.id);
  const { appliedJobs = [], totalAppliedJobs = 0, jobsStatus, jobsError } = useSelector((state) => state.jobs || {});
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const jobsPerPage = 4;

  const fetchJobs = async (reset = false) => {
    if (!candidateId) {
      setError('Please log in to view applied jobs.');
      navigate('/login');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      console.log('Dispatching fetchAppliedJobs:', { userId: candidateId, searchQuery, statusFilter, page, limit: jobsPerPage });
    const result = await dispatch(
  fetchAppliedJobs({
    search: searchQuery,
    status: statusFilter,
    page,
    limit: jobsPerPage,
  })
).unwrap();

      console.log('Fetched jobs result:', result);

      // Update local state
      setJobs((prev) => (reset || page === 1 ? result.jobs : [...prev, ...result.jobs]));
      setTotalJobs(result.total);
    } catch (err) {
      console.error('fetchJobs error:', err);
      setError(err || 'Failed to load applied jobs.');
      if (err.includes('HTML response') || err === 'No authentication token found' || err.includes('authenticate')) {
        dispatch(logoutUser());
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchJobs(true);
  }, [candidateId, searchQuery, statusFilter]);

  useEffect(() => {
    if (page > 1) fetchJobs();
  }, [page]);

  // Optional: Sync with Redux state (if you want to use Redux state directly)
  useEffect(() => {
    if (jobsStatus === 'succeeded') {
      setJobs((prev) => (page === 1 ? appliedJobs : [...prev, ...appliedJobs]));
      setTotalJobs(totalAppliedJobs);
      setError(null);
    } else if (jobsStatus === 'failed' && jobsError) {
      setError(jobsError || 'Failed to load applied jobs.');
      if (jobsError.includes('HTML response') || jobsError.includes('authenticate')) {
        dispatch(logoutUser());
        navigate('/login');
      }
    }
  }, [jobsStatus, appliedJobs, totalAppliedJobs, jobsError, page, dispatch, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  return (
    <div className="min-h-screen bg-white">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <div className="hidden lg:block w-72 text-white shadow-2xl">
          <Sidebar />
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={toggleSidebar}
            aria-hidden="true"
          >
            <div
              className="absolute left-0 top-0 h-full w-72 bg-indigo-900 text-white z-50 transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Applied Jobs</h2>
            <button
              onClick={toggleFilter}
              className="sm:hidden flex items-center px-3 py-1.5 bg-teal-100 text-teal-700 rounded-md text-sm font-medium hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Toggle filters"
            >
              <Filter size={16} className="mr-1" /> Filters
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-fade-in">
              {error}
              <div className="mt-2">
                <button
                  onClick={() => setError(null)}
                  className="ml-4 text-red-700 hover:text-red-900 font-medium focus:outline-none focus:underline"
                  aria-label="Dismiss error"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div
            className={`${
              isFilterOpen ? 'block' : 'hidden sm:block'
            } sticky top-0 z-10 bg-white p-4 -mx-4 sm:mx-0 sm:p-0 mb-6 border-b border-gray-200 animate-slide-down`}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors shadow-sm text-sm"
                  aria-label="Search applied jobs"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-44 p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors shadow-sm text-sm"
                aria-label="Filter by application status"
              >
                <option value="All">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {isLoading && jobs.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
              <span className="ml-2 text-gray-600 text-sm font-medium" aria-live="polite">Loading jobs...</span>
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-md border border-gray-100 shadow-sm">
              <p className="text-gray-600 text-base mb-4">No applied jobs match your filters.</p>
              <Link
                to="/jobsearch"
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors text-sm"
                aria-label="Browse available jobs"
              >
                Browse Jobs <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-md shadow-sm p-5 border border-gray-100 hover:border-teal-200 transition-all duration-300 animate-fade-in"
                >
                  <div className="flex items-start">
                    <img
                      src={job.logo || 'https://via.placeholder.com/40'}
                      alt={`${job.company_name} logo`}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{job.title}</h3>
                      <div className="text-sm text-gray-500 space-y-1 mt-1">
                        <div className="flex flex-wrap gap-2">
                          <span>{job.company_name}</span>
                          <span className="text-gray-300">|</span>
                          <span>{job.location}</span>
                          <span className="text-gray-300">|</span>
                          <span>Applied {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>{job.salary || 'Not disclosed'}</div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.tags && job.tags.length > 0 ? (
                          job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 text-xs rounded-full bg-teal-100 text-teal-700 font-medium"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No tags</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Status: </span>
                    <span
                      className={`${
                        job.status === 'Shortlisted' || job.status === 'Interview Scheduled'
                          ? 'text-teal-600'
                          : job.status === 'Under Review'
                          ? 'text-amber-600'
                          : job.status === 'Rejected'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      } font-medium`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Recruiter Actions: </span>
                    {job.recruiterActions?.invitationSent ? (
                      <span className="text-teal-600">
                        <Mail size={14} className="inline mr-1" /> Invitation Sent
                      </span>
                    ) : (
                      <span className="text-gray-400">No invitation</span>
                    )}
                    {job.recruiterActions?.resumeDownloaded && (
                      <span className="text-amber-600 ml-3">
                        <Download size={14} className="inline mr-1" /> Resume Downloaded
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/job/${job.job_id}`}
                    className="mt-3 inline-flex items-center text-teal-600 hover:text-teal-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
                    aria-label={`View details for ${job.title}`}
                  >
                    View Details <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {jobs.length > 0 && totalJobs > jobs.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setPage(page + 1)}
                disabled={isLoading || jobsStatus === 'loading'}
                className={`inline-flex items-center px-5 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                  isLoading || jobsStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Load more applied jobs"
              >
                {isLoading || jobsStatus === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Applied;