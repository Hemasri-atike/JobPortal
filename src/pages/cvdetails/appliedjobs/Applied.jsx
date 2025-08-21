import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Mail, Download } from 'lucide-react';
import Header from '../../navbar/Header';
import Sidebar from '../layout/Sidebar';

const Applied = () => {
  const candidateId = useSelector(state => state.profile.data?.id);
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const jobsPerPage = 4;

  const fetchJobs = async () => {
    if (!candidateId) return;
    setIsLoading(true);

    const params = new URLSearchParams({
      search: searchQuery,
      status: statusFilter,
      page,
      limit: jobsPerPage
    });

    try {
      const res = await fetch(`http://localhost:5000/api/candidate/${candidateId}/applied-jobs?${params}`);
      const data = await res.json();
      if (page === 1) setJobs(data);
      else setJobs(prev => [...prev, ...data]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch whenever candidateId, filters, or page changes
  useEffect(() => {
    setPage(1);
    fetchJobs();
  }, [candidateId, searchQuery, statusFilter]);

  useEffect(() => {
    if (page > 1) fetchJobs();
  }, [page]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block w-64 bg-gray-100">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Applied Jobs</h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by job title or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
            </select>
          </div>

          {/* Job List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600 text-center">No applied jobs match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
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
                          <span key={tag} className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">{tag}</span>
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
                      <span className="text-green-600"><Mail size={14} className="inline mr-1"/> Invitation Sent</span>
                    )}
                    {job.recruiterActions.resumeDownloaded && (
                      <span className="text-yellow-600 ml-2"><Download size={14} className="inline mr-1"/> Resume Downloaded</span>
                    )}
                  </div>
                  <Link to={`/job/${job.jobId}`} className="mt-2 text-blue-600 hover:underline text-sm flex items-center">
                    View Details <ChevronRight size={16} className="inline ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {jobs.length >= jobsPerPage && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setPage(page + 1)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Applied;
