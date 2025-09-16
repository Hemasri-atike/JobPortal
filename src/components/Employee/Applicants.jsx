import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Mail, Download, Filter } from 'lucide-react';
import Header from '../../pages/navbar/Header.jsx';
import Sidebar from '../../pages/cvdetails/layout/Sidebar.jsx';
import axios from 'axios';
import { logoutUser } from '../../store/userSlice.js';

const Applicants = () => {
  const dispatch = useDispatch();
  const employerId = useSelector((state) => state.user.userInfo?.id);
  const userRole = useSelector((state) => state.user.userInfo?.role);
  const [applicants, setApplicants] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const applicantsPerPage = 4;

  const axiosAuth = (token) => {
    const instance = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { Authorization: `Bearer ${token}` },
    });
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const res = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            dispatch(logoutUser());
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return instance;
  };

  const fetchApplicants = async (reset = false) => {
    if (!employerId || userRole !== 'employer') {
      setError('Please log in as an employer to view applicants.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      console.log('Fetching applicants for:', { employerId, token: token.substring(0, 20) + '...', searchQuery, statusFilter, page, limit: applicantsPerPage });
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter,
        page,
        limit: applicantsPerPage,
      });
      const res = await axiosAuth(token).get(`/applications/employer?${params}`);
      const { applicants: fetchedApplicants, total } = res.data;
      if (reset || page === 1) {
        setApplicants(fetchedApplicants || []);
      } else {
        setApplicants((prev) => [...prev, ...(fetchedApplicants || [])]);
      }
      setTotalApplicants(total || fetchedApplicants.length);
      console.log(`Fetched applicants:`, fetchedApplicants, { total });
    } catch (err) {
      console.error('Fetch applicants error:', {
        message: err.message,
        status: err.response?.status,
        details: err.response?.data?.details,
      });
      setError(
        err.response?.status === 403
          ? 'You do not have permission to view applicants. Please ensure you are logged in as an employer.'
          : err.response?.data?.details || err.message || 'Failed to load applicants.'
      );
      if (err.response?.status === 401) {
        setTimeout(() => (window.location.href = '/login'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchApplicants(true);
  }, [employerId, userRole, searchQuery, statusFilter]);

  useEffect(() => {
    if (page > 1) fetchApplicants();
  }, [page]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleDownloadResume = async (applicantId, applicantName) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axiosAuth(token).get(`/applications/${applicantId}/resume`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${applicantName}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download resume.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <div className="hidden lg:block w-72 bg-indigo-900 text-white shadow-2xl">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Applicants</h2>
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
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-700 hover:text-red-900 font-medium focus:outline-none focus:underline"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
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
                  placeholder="Search by applicant name or position"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors shadow-sm text-sm"
                  aria-label="Search applicants"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-44 p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors shadow-sm text-sm"
                aria-label="Filter by application status"
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {isLoading && applicants.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
              <span className="ml-2 text-gray-600 text-sm font-medium" aria-live="polite">Loading applicants...</span>
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-md border border-gray-100 shadow-sm">
              <p className="text-gray-600 text-base mb-4">No applicants match your filters.</p>
              <Link
                to="/jobs/post"
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors text-sm"
                aria-label="Post a new job"
              >
                Post a Job <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-white rounded-md shadow-sm p-5 border border-gray-100 hover:border-teal-200 transition-all duration-300 animate-fade-in"
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                      {applicant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{applicant.name}</h3>
                      <div className="text-sm text-gray-500 space-y-1 mt-1">
                        <div className="flex flex-wrap gap-2">
                          <span>{applicant.email}</span>
                          <span className="text-gray-300">|</span>
                          <span>{applicant.position}</span>
                          <span className="text-gray-300">|</span>
                          <span>Applied {new Date(applicant.applicationDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Status: </span>
                    <span
                      className={`${
                        applicant.status === 'Shortlisted' || applicant.status === 'Interview Scheduled'
                          ? 'text-teal-600'
                          : applicant.status === 'Under Review'
                          ? 'text-amber-600'
                          : applicant.status === 'Rejected'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      } font-medium`}
                    >
                      {applicant.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {applicant.resumeUrl && (
                      <button
                        onClick={() => handleDownloadResume(applicant.id, applicant.name)}
                        className="flex items-center px-3 py-1.5 bg-teal-100 text-teal-700 rounded-md text-sm font-medium hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        aria-label={`Download resume for ${applicant.name}`}
                      >
                        <Download size={14} className="mr-1" /> Resume
                      </button>
                    )}
                    <Link
                      to={`/applicant/${applicant.id}`}
                      className="flex items-center px-3 py-1.5 text-teal-600 hover:text-teal-800 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                      aria-label={`View details for ${applicant.name}`}
                    >
                      View Details <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {applicants.length > 0 && totalApplicants > applicants.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setPage(page + 1)}
                disabled={isLoading}
                className={`inline-flex items-center px-5 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Load more applicants"
              >
                {isLoading ? (
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

export default Applicants;