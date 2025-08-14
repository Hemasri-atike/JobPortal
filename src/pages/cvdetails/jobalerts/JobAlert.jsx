import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Edit, Trash, Plus, Search } from 'lucide-react';
import Header from '../../navbar/Header';
import Sidebar from '../layout/Sidebar';

const JobAlert = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // Mock data (replace with API call)
  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch: axios.get('/api/candidate/job-alerts')
    setTimeout(() => {
      setAlerts([
        {
          id: 1,
          keywords: 'Software Engineer',
          location: 'London, UK',
          salaryMin: '30000',
          salaryMax: '50000',
          jobType: 'Full Time',
          frequency: 'Daily',
        },
        {
          id: 2,
          keywords: 'Product Manager',
          location: 'Remote',
          salaryMin: '40000',
          salaryMax: '60000',
          jobType: 'Part Time',
          frequency: 'Weekly',
        },
        {
          id: 3,
          keywords: 'Data Analyst',
          location: 'New York, USA',
          salaryMin: '35000',
          salaryMax: '55000',
          jobType: 'Freelancer',
          frequency: 'Daily',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter alerts by search query
  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission for creating/editing alerts
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentAlert.keywords || !currentAlert.location) {
      alert('Keywords and location are required.');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (currentAlert.id) {
        // Update existing alert
        setAlerts(
          alerts.map((alert) =>
            alert.id === currentAlert.id ? { ...currentAlert } : alert
          )
        );
      } else {
        // Create new alert
        setAlerts([...alerts, { ...currentAlert, id: alerts.length + 1 }]);
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
      setIsLoading(false);
    }, 1000);
  };

  // Handle edit alert
  const handleEdit = (alert) => {
    setCurrentAlert(alert);
    setIsEditing(true);
  };

  // Handle delete alert
  const handleDelete = (id) => {
    setIsLoading(true);
    // Simulate API delete: axios.delete(`/api/candidate/job-alerts/${id}`)
    setTimeout(() => {
      setAlerts(alerts.filter((alert) => alert.id !== id));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1">
        {/* Sidebar (hidden on small screens) */}
        <div className="hidden md:block w-64 bg-gray-900">
          <Sidebar />
        </div>

        {/* Sidebar for mobile */}
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

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Job Alerts</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              aria-label="Create new job alert"
            >
              <Plus size={16} className="mr-2" />
              Create Alert
            </button>
          </div>

          {isEditing ? (
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
                    onChange={(e) =>
                      setCurrentAlert({ ...currentAlert, keywords: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Job title keywords"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Location</label>
                  <input
                    type="text"
                    value={currentAlert.location}
                    onChange={(e) =>
                      setCurrentAlert({ ...currentAlert, location: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Location"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Salary Range (Min)</label>
                  <input
                    type="number"
                    value={currentAlert.salaryMin}
                    onChange={(e) =>
                      setCurrentAlert({ ...currentAlert, salaryMin: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Minimum salary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Salary Range (Max)</label>
                  <input
                    type="number"
                    value={currentAlert.salaryMax}
                    onChange={(e) =>
                      setCurrentAlert({ ...currentAlert, salaryMax: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Maximum salary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Job Type</label>
                  <select
                    value={currentAlert.jobType}
                    onChange={(e) =>
                      setCurrentAlert({ ...currentAlert, jobType: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Job type"
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
                    onChange={(e) =>
                      setCurrentAlert({ ...currentAlert, frequency: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    aria-label="Notification frequency"
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
                    aria-label={currentAlert.id ? 'Update job alert' : 'Create job alert'}
                  >
                    {currentAlert.id ? 'Update' : 'Create'}
                  </button>
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
                    className="text-gray-600 hover:text-gray-800 text-sm"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search alerts by keywords or location"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    aria-label="Search job alerts"
                  />
                </div>
              </div>

              {/* Alerts List */}
              {isLoading ? (
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
                          <span className="font-medium">Job Type:</span>{' '}
                          {alert.jobType || 'Not specified'}
                        </p>
                        <p>
                          <span className="font-medium">Frequency:</span> {alert.frequency}
                        </p>
                      </div>
                      <div className="flex gap-4 mt-4">
                        <Link
                          to={`/jobsearch?keywords=${encodeURIComponent(
                            alert.keywords
                          )}&location=${encodeURIComponent(alert.location)}`}
                          className="text-blue-600 hover:underline text-sm flex items-center"
                          aria-label={`Search jobs for ${alert.keywords} in ${alert.location}`}
                        >
                          View Matching Jobs
                        </Link>
                        <button
                          onClick={() => handleEdit(alert)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                          aria-label={`Edit alert for ${alert.keywords}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(alert.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                          aria-label={`Delete alert for ${alert.keywords}`}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 text-center">
                  <p className="text-gray-700">
                    No job alerts found. Create a new alert to get started.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobAlert;