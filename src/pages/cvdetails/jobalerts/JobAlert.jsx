import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Edit, Trash, Plus, Search } from 'lucide-react';
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
      alert('Keywords and location are required.');
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
    <div className="flex flex-col h-screen bg-gray-100">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1">
        <div className="hidden md:block w-64 bg-gray-900">
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Job Alerts</h3>
            {isEmployee && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus size={16} className="mr-2" /> Create Alert
              </button>
            )}
          </div>

          {/* Success/Error Messages */}
          {success && <div className="text-green-600 mb-4">{success}</div>}
          {error && <div className="text-red-600 mb-4">{error}</div>}

          {/* Create/Edit Form */}
          {isEditing && isEmployee && (
            <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                {currentAlert.id ? 'Edit Job Alert' : 'Create New Job Alert'}
              </h4>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Job Title Keywords</label>
                  <input
                    type="text"
                    value={currentAlert.keywords}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, keywords: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Location</label>
                  <input
                    type="text"
                    value={currentAlert.location}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, location: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Salary Range (Min)</label>
                  <input
                    type="number"
                    value={currentAlert.salaryMin}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, salaryMin: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Salary Range (Max)</label>
                  <input
                    type="number"
                    value={currentAlert.salaryMax}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, salaryMax: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Job Type</label>
                  <select
                    value={currentAlert.jobType}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, jobType: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Notification Frequency</label>
                  <select
                    value={currentAlert.frequency}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, frequency: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    {currentAlert.id ? 'Update' : 'Create'}
                  </button>
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
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search alerts by keywords or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Alerts List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          ) : filteredAlerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="bg-white shadow rounded-lg p-4 sm:p-6">
                  <div className="flex items-center mb-4">
                    <Bell className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <h4 className="text-base font-semibold text-gray-800">{alert.keywords}</h4>
                      <p className="text-sm text-gray-600">{alert.location}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Salary Range:</span>{' '}
                      {alert.salaryMin && alert.salaryMax
                        ? `$${alert.salaryMin} - $${alert.salaryMax}`
                        : 'Not specified'}
                    </p>
                    <p>
                      <span className="font-medium">Job Type:</span> {alert.jobType || 'Not specified'}
                    </p>
                    <p>
                      <span className="font-medium">Frequency:</span> {alert.frequency}
                    </p>
                  </div>
                  {isEmployee && (
                    <div className="flex gap-4 mt-4">
                      <Link
                        to={`/jobsearch?keywords=${encodeURIComponent(alert.keywords)}&location=${encodeURIComponent(alert.location)}`}
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        View Matching Jobs
                      </Link>
                      <button onClick={() => handleEdit(alert)} className="text-blue-600 hover:text-blue-700 text-sm">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(alert.id)} className="text-red-600 hover:text-red-700 text-sm">
                        <Trash size={16} />
                      </button>
                    </div>
                  )}
                  {isCandidate && (
                    <div className="mt-4">
                      <Link
                        to={`/jobsearch?keywords=${encodeURIComponent(alert.keywords)}&location=${encodeURIComponent(alert.location)}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Matching Jobs
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-4 sm:p-6 text-center">
              <p className="text-gray-700">
                No job alerts found.
                {isEmployee ? ' Create a new alert to get started.' : ''}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobAlert;
