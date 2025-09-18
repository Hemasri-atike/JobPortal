import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Search, Filter, Download } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../pages/navbar/Header.jsx';
import Sidebar from '../../pages/cvdetails/layout/Sidebar.jsx';
import {
  setSearchQuery,
  setStatusFilter,
  setPage,
  fetchApplicants,
  updateApplicantStatus,
  clearApplicantsState,
} from '../../store/jobsSlice.js';

// Debounce utility to delay search input
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Applicants = () => {
  const { jobId } = useParams(); // Get jobId from URL
  const dispatch = useDispatch();
  const employerId = useSelector((state) => state.user.userInfo?.id);
  const userRole = useSelector((state) => state.user.userInfo?.role);
  const { applicants, total, page, jobsPerPage, statusFilter, searchQuery, jobsStatus, jobsError } =
    useSelector((state) => state.jobs);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');

  const jobApplicants = applicants[jobId] || []; // Safely access applicants for jobId

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      dispatch(setSearchQuery(value));
    }, 300),
    [dispatch]
  );

  // Fetch applicants data
  const fetchApplicantsData = useCallback(
    (reset = false) => {
      if (!employerId || userRole !== 'employer') {
        toast.error('Please log in as an employer to view applicants.');
        return;
      }
      if (!jobId) {
        toast.error('Job ID is required to fetch applicants.');
        return;
      }
      setIsLoading(true);
      dispatch(fetchApplicants({ jobId, statusFilter, searchQuery, page: reset ? 1 : page, jobsPerPage }))
        .unwrap()
        .finally(() => setIsLoading(false));
    },
    [dispatch, employerId, userRole, jobId, statusFilter, searchQuery, page, jobsPerPage]
  );

  // Download resume handler
  const handleDownloadResume = async (applicantId, applicantName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const res = await fetch(`http://localhost:5000/api/applicants/${applicantId}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to download resume: ${res.statusText}`);
      const contentType = res.headers.get('Content-Type');
      const extension = contentType.includes('pdf') ? 'pdf' : 'file';
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${applicantName.replace(/\s+/g, '_')}_resume.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download resume error:', err);
      toast.error(`Failed to download resume: ${err.message}`);
    }
  };

  // Update applicant status handler
  const handleStatusUpdate = async (applicantId, newStatus) => {
    try {
      if (newStatus === 'Interview Scheduled') {
        setShowInterviewModal(applicantId);
      } else {
        await dispatch(updateApplicantStatus({ applicationId: applicantId, status: newStatus })).unwrap();
        toast.success('Applicant status updated successfully.');
      }
    } catch (err) {
      console.error('Status update error:', err);
      toast.error(`Failed to update applicant status: ${err.message}`);
    }
  };

  // Schedule interview handler
  const handleScheduleInterview = async (applicantId) => {
    if (!interviewDate) {
      toast.error('Please select an interview date and time.');
      return;
    }
    const selectedDate = new Date(interviewDate);
    if (isNaN(selectedDate.getTime())) {
      toast.error('Invalid date format.');
      return;
    }
    if (selectedDate < new Date()) {
      toast.error('Interview date cannot be in the past.');
      return;
    }
    try {
      await dispatch(
        updateApplicantStatus({ applicationId: applicantId, status: 'Interview Scheduled', interviewDate })
      ).unwrap();
      toast.success('Interview scheduled successfully.');
      setShowInterviewModal(null);
      setInterviewDate('');
    } catch (err) {
      console.error('Schedule interview error:', err);
      toast.error(`Failed to schedule interview: ${err.message}`);
    }
  };

  // Fetch applicants on mount or filter/search change
  useEffect(() => {
    fetchApplicantsData(true);
  }, [fetchApplicantsData, statusFilter, searchQuery]);

  // Fetch additional applicants on page change
  useEffect(() => {
    if (page > 1) fetchApplicantsData();
  }, [fetchApplicantsData, page]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <div className="hidden lg:block w-72 text-white shadow-2xl">
          <Sidebar role="employer" />
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={toggleSidebar}
            aria-hidden="true"
          >
            <div
              className="absolute left-0 top-0 h-full w-72 text-white z-50 transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar role="employer" />
            </div>
          </div>
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Applicants for Job ID: {jobId}</h2>
            <button
              onClick={toggleFilter}
              className="sm:hidden flex items-center px-3 py-1.5 bg-teal-100 text-teal-700 rounded-md text-sm font-medium hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Toggle filters"
            >
              <Filter size={16} className="mr-1" /> Filters
            </button>
          </div>

          {jobsError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 animate-fade-in">
              {jobsError}
              <button
                onClick={() => dispatch(clearApplicantsState())}
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
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors shadow-sm text-sm"
                  aria-label="Search applicants by name or position"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                className="w-full sm:w-44 p-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors shadow-sm text-sm"
                aria-label="Filter applicants by application status"
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

          {isLoading && jobApplicants.length === 0 ? (
            <div className="space-y-4">
              {[...Array(jobsPerPage)].map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-md shadow-sm border animate-pulse">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="ml-4 flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobApplicants.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-md border border-gray-100 shadow-sm">
              <p className="text-gray-600 text-base mb-4">No applicants match your filters.</p>
              <button
                onClick={() => {
                  dispatch(setSearchQuery(''));
                  dispatch(setStatusFilter('All'));
                }}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors text-sm"
                aria-label="Reset filters"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Showing {jobApplicants.length} of {total} applicants
              </p>
              {jobApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-white rounded-md shadow-sm p-5 border border-gray-100 hover:border-teal-200 transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                      {applicant.name?.charAt(0).toUpperCase() || 'N/A'}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                        {applicant.name || 'Unknown'}
                      </h3>
                      <div className="text-sm text-gray-500 space-y-1 mt-1">
                        <div className="flex flex-wrap gap-2">
                          <span>{applicant.email || 'N/A'}</span>
                          <span className="text-gray-300">|</span>
                          <span>{applicant.position || 'N/A'}</span>
                          <span className="text-gray-300">|</span>
                          <span>
                            Applied{' '}
                            {applicant.applicationDate
                              ? new Date(applicant.applicationDate).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'N/A'}
                          </span>
                        </div>
                        {applicant.interviewDate && (
                          <div>
                            <span className="font-medium">Interview: </span>
                            {new Date(applicant.interviewDate).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </div>
                        )}
                        {applicant.notes?.length > 0 && (
                          <div>
                            <span className="font-medium">Notes: </span>
                            {applicant.notes.join(', ')}
                          </div>
                        )}
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
                      {applicant.status || 'N/A'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 items-center">
                    <select
                      value={applicant.status || 'Applied'}
                      onChange={(e) => handleStatusUpdate(applicant.id, e.target.value)}
                      className="p-1.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      aria-label={`Update application status for ${applicant.name || 'applicant'}`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    {applicant.resumeUrl ? (
                      <button
                        onClick={() => handleDownloadResume(applicant.id, applicant.name || 'applicant')}
                        className="flex items-center px-3 py-1.5 bg-teal-100 text-teal-700 rounded-md text-sm font-medium hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        aria-label={`Download resume for ${applicant.name || 'applicant'}`}
                      >
                        <Download size={14} className="mr-1" /> Resume
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">No resume available</span>
                    )}
                    <Link
                      to={`/applicant/${applicant.id}`}
                      className="flex items-center px-3 py-1.5 text-teal-600 hover:text-teal-800 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                      aria-label={`View details for ${applicant.name || 'applicant'}`}
                    >
                      View Details <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showInterviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Schedule Interview</h3>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md mb-4"
                  aria-label="Select interview date and time"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleScheduleInterview(showInterviewModal)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    aria-label="Confirm interview schedule"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setShowInterviewModal(null);
                      setInterviewDate('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    aria-label="Cancel interview scheduling"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {jobApplicants.length > 0 && total > jobApplicants.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() => dispatch(setPage(page + 1))}
                disabled={isLoading || jobApplicants.length >= total}
                className={`inline-flex items-center px-5 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                  isLoading || jobApplicants.length >= total ? 'opacity-50 cursor-not-allowed' : ''
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