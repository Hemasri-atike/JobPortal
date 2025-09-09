import { Briefcase, PlusCircle, Users, Building, BarChart, Calendar, Share2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../pages/navbar/Header";
import Sidebar from "../../pages/cvdetails/layout/Sidebar";
import { fetchEmployerDashboard, clearDashboard } from "../../store/dashboardSlice";
import { createSelector } from 'reselect';

// Memoized selectors for stability
const selectUserState = createSelector(
  [(state) => state.user || {}],
  (user) => ({
    userInfo: user.userInfo || null,
    userType: user.userType || null,
  })
);

const selectDashboardState = createSelector(
  [(state) => state.dashboard || {}],
  (dashboard) => ({
    profile: dashboard.profile || null,
    notifications: dashboard.notifications || [],
    jobs: dashboard.jobs || [],
    stats: dashboard.stats || { activePostings: 0, totalApplications: 0, views: 0 },
    isLoading: dashboard.isLoading || false,
    error: dashboard.error || null,
  })
);

const EmpDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, userType } = useSelector(selectUserState);
  const { profile, notifications, jobs, stats, isLoading, error } = useSelector(selectDashboardState);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const token = userInfo?.token || localStorage.getItem("token") || null;

  console.log('Redux user state:', { userInfo, userType, token });

  useEffect(() => {
    console.log('EmpDashboard useEffect:', { userInfo, userType, token, isLoading });

    // Authentication and role check
    if (!userInfo || !userType) {
      console.error('Authentication failed - No userInfo or userType:', { userInfo, userType });
      toast.error('Please log in to view the employer dashboard.');
      navigate('/login?type=employer', { state: { from: '/empdashboard' } });
      return;
    }

    const normalizedUserType = userType?.toLowerCase();
    const allowedRoles = ['employer', 'admin', 'company'];
    if (!allowedRoles.includes(normalizedUserType)) {
      console.error('Unauthorized userType:', { userType, normalizedUserType });
      toast.error('Only employers or admins can view the dashboard.');
      navigate(normalizedUserType === 'employer' ? '/jobsearch' : '/');
      return;
    }

    if (!token) {
      console.error('No token available for API requests:', { userInfo });
      toast.error('Authentication token missing. Please log in again.');
      navigate('/login?type=employer', { state: { from: '/empdashboard' } });
      return;
    }

    // Timeout for API call
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.error('API request timeout for dashboard');
        setTimeoutReached(true);
        toast.error('Request timed out. Please try again.');
      }
    }, 10000);

    console.log('Dispatching fetchEmployerDashboard with token:', token ? 'present' : 'missing');
    dispatch(fetchEmployerDashboard());

    return () => {
      clearTimeout(timeoutId);
      dispatch(clearDashboard());
      console.log('EmpDashboard cleanup: Cleared timeout and dashboard state');
    };
  }, [dispatch, navigate, userInfo, userType, token]);

  // Error handling
  if (error) {
    console.error('Dashboard error:', { error });
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-indigo-50 flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar role="employer" />
          <main className="flex-1 p-6 lg:p-10">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error loading dashboard: {error}.
              {error.includes('Unauthorized') && ' Only employers or admins can access this dashboard.'}
              {error.includes('Not Found') && ' Dashboard data not found. Please check backend configuration.'}
            </div>
            <button
              onClick={() => {
                setTimeoutReached(false);
                if (!token) {
                  toast.error('Authentication token missing. Please log in again.');
                  navigate('/login?type=employer', { state: { from: '/empdashboard' } });
                  return;
                }
                console.log('Retrying fetchEmployerDashboard');
                dispatch(fetchEmployerDashboard());
              }}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Retry
            </button>
          </main>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-indigo-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar role="employer" />
        <main className="flex-1 p-6 lg:p-10">
          <header className="bg-gradient-to-br from-gray-50 via-teal-50 to-indigo-50 text-white rounded-3xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center shadow-lg">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl text-indigo-400 font-bold tracking-tight">
                Employer Dashboard
              </h1>
              <p className="text-teal-600 mt-2 text-lg">
                Welcome, <span className="font-semibold">{profile?.name || userInfo?.name || "Employer"}</span> 🚀
              </p>
            </div>
            <Link
              to="/empposting"
              className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out hover:bg-teal-50 hover:shadow-lg transform hover:scale-105"
            >
              Post New Job
            </Link>
          </header>

          {isLoading && !timeoutReached ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <span className="ml-2 text-gray-600">Loading dashboard...</span>
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
                  <BarChart className="text-teal-500 w-8 h-8 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-semibold text-teal-600">{stats.activePostings || 0}</p>
                      <p className="text-gray-500">Active Postings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-semibold text-teal-600">{stats.totalApplications || 0}</p>
                      <p className="text-gray-500">Total Applicants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-semibold text-teal-600">{stats.views || 0}</p>
                      <p className="text-gray-500">Job Views</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
                  <Briefcase className="text-indigo-500 w-8 h-8 mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Job Listings</h2>
                  <p className="text-gray-500 mb-4">
                    {jobs.length || 0} jobs available
                    {jobs.length === 0 && " No jobs available yet"}
                  </p>
                  <Link to="/joblistings" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                    Explore Jobs →
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
                  <PlusCircle className="text-teal-500 w-8 h-8 mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Your Postings</h2>
                  <p className="text-gray-500 mb-4">
                    {jobs.length || 0} active jobs
                    {jobs.length === 0 && " No active jobs yet"}
                  </p>
                  <Link to="/empposting" className="text-teal-600 hover:text-teal-800 font-semibold transition-colors">
                    Manage Jobs →
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
                  <Users className="text-rose-500 w-8 h-8 mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Recent Applicants</h2>
                  <p className="text-gray-500 mb-4">
                    {stats.totalApplications || 0} new applicants
                    {stats.totalApplications === 0 && " No applicants yet"}
                  </p>
                  <Link to="/applicants" className="text-rose-600 hover:text-rose-800 font-semibold transition-colors">
                    Review Applicants →
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
                  <Building className="text-indigo-600 w-8 h-8 mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Company Profile</h2>
                  <p className="text-gray-500 mb-4">
                    {profile?.company_name ? `Manage ${profile.company_name}` : "Update your company details"}
                  </p>
                  <Link to="/cmpprofile" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                    Edit Profile →
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
                  <BarChart className="text-rose-600 w-8 h-8 mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Job Performance</h2>
                  <p className="text-gray-500 mb-4">Track job views and applications</p>
                  <Link to="/jobperformance" className="text-rose-600 hover:text-rose-800 font-semibold transition-colors">
                    View Metrics →
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
                  <Share2 className="text-teal-600 w-8 h-8 mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Team Collaboration</h2>
                  <p className="text-gray-500 mb-4">Manage hiring team</p>
                  <Link to="/team" className="text-teal-600 hover:text-teal-800 font-semibold transition-colors">
                    Invite Team →
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
                  <Calendar className="text-indigo-500 w-8 h-8 mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Scheduled Interviews</h2>
                  <p className="text-gray-500 mb-4">
                    {notifications.filter(n => n.type === 'interview')?.length || 0} upcoming interviews
                    {notifications.filter(n => n.type === 'interview')?.length === 0 && " No upcoming interviews"}
                  </p>
                  <Link to="/interviews" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                    View Schedule →
                  </Link>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EmpDashboard;