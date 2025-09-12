import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Edit, Trash, Plus, Search, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../navbar/Header';
import Sidebar from '../layout/Sidebar';
import {
  fetchJobAlerts,
  addJobAlert,
  updateJobAlert,
  deleteJobAlert,
  clearJobAlertMessages,
} from '../../../store/jobalertSlice.js';

const JobAlert = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlert, setCurrentAlert] = useState({
    id: null,
    keywords: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: '',
    frequency: 'Daily',
  });

  const dispatch = useDispatch();
  const { alerts, loading, error, success } = useSelector((state) => state.jobalerts);
  const user = useSelector((state) => state.user?.user || null);
  const isEmployee = user?.role === 'employee';
  const isCandidate = user?.role === 'candidate';

  // Fetch job alerts on mount
  useEffect(() => {
    dispatch(fetchJobAlerts());
  }, [dispatch]);

  // Clear success/error messages on unmount
  useEffect(() => {
    return () => dispatch(clearJobAlertMessages());
  }, [dispatch]);

  // Filter alerts
  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Create/Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentAlert.keywords || !currentAlert.location) {
      // Use toast or inline error instead of alert()
      return;
    }

    if (currentAlert.id) {
      dispatch(updateJobAlert({ id: currentAlert.id, alertData: currentAlert }));
    } else {
      dispatch(addJobAlert(currentAlert));
    }

    setIsEditing(false);
    setCurrentAlert({
      id: null,
      keywords: '',
      location: '',
      salaryMin: '',
      salaryMax: '',
      jobType: '',
      frequency: 'Daily',
    });
  };

  // Edit
  const handleEdit = (alert) => {
    setCurrentAlert(alert);
    setIsEditing(true);
  };

  // Delete
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    dispatch(deleteJobAlert(id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-sm">
          <Sidebar />
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Job Alerts</h1>
              <p className="text-gray-600 mt-1">Manage your personalized job alert preferences</p>
            </div>
            {isEmployee && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                <Plus size={18} className="mr-2" />
                Create Alert
              </button>
            )}
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-800 text-sm">{success}</span>
              <button
                onClick={() => dispatch(clearJobAlertMessages())}
                className="ml-auto text-green-600 hover:text-green-800"
              >
                <X size={16} />
              </button>
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
              <button
                onClick={() => dispatch(clearJobAlertMessages())}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Create/Edit Form */}
          {isEditing && isEmployee && (
            <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentAlert.id ? 'Edit Job Alert' : 'Create New Job Alert'}
                </h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentAlert({
                      id: null,
                      keywords: '',
                      location: '',
                      salaryMin: '',
                      salaryMax: '',
                      jobType: '',
                      frequency: 'Daily',
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Job Keywords *</label>
                  <input
                    type="text"
                    value={currentAlert.keywords}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., React Developer, Full Stack"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location *</label>
                  <input
                    type="text"
                    value={currentAlert.location}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., Remote, New York"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Salary Min ($)</label>
                  <input
                    type="number"
                    value={currentAlert.salaryMin}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, salaryMin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., 50000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Salary Max ($)</label>
                  <input
                    type="number"
                    value={currentAlert.salaryMax}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, salaryMax: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., 100000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Job Type</label>
                  <select
                    value={currentAlert.jobType}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, jobType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Any</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Frequency</label>
                  <select
                    value={currentAlert.frequency}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentAlert({
                        id: null,
                        keywords: '',
                        location: '',
                        salaryMin: '',
                        salaryMax: '',
                        jobType: '',
                        frequency: 'Daily',
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm"
                  >
                    {currentAlert.id ? 'Update Alert' : 'Create Alert'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search alerts by keywords or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Alerts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600">Loading alerts...</span>
            </div>
          ) : filteredAlerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <Bell className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 truncate">{alert.keywords}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.location}</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-500">Salary</span>
                      <span className="text-sm font-medium text-gray-900">
                        {alert.salaryMin && alert.salaryMax
                          ? `$${alert.salaryMin}k - $${alert.salaryMax}k`
                          : 'Any'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className="text-sm font-medium text-gray-900">{alert.jobType || 'Any'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-500">Frequency</span>
                      <span className="text-sm font-medium text-gray-900">{alert.frequency}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-100">
                    <Link
                      to={`/jobsearch?keywords=${encodeURIComponent(alert.keywords)}&location=${encodeURIComponent(alert.location)}&salaryMin=${alert.salaryMin}&salaryMax=${alert.salaryMax}&jobType=${alert.jobType}`}
                      className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      View Jobs
                    </Link>
                    {isEmployee && (
                      <>
                        <button
                          onClick={() => handleEdit(alert)}
                          className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                          aria-label="Edit alert"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(alert.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          aria-label="Delete alert"
                        >
                          <Trash size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-xl p-12 text-center border border-gray-200">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Alerts Yet</h3>
              <p className="text-gray-600 mb-6">
                Set up your first alert to receive personalized job notifications.
              </p>
              {isEmployee && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  Create Your First Alert
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobAlert;