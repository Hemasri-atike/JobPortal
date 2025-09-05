import { Briefcase, PlusCircle, Users, Building, BarChart, Calendar, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Header from "../../pages/navbar/Header";
import Sidebar from "../../pages/cvdetails/layout/Sidebar";
import { fetchJobs } from "../../store/jobsSlice";
import { fetchPostedJobs } from "../../store/postingSlice";

const EmpDashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const jobs = useSelector((state) => state.jobs?.jobs || []);
  const postedJobs = useSelector((state) => state.postedJobs?.list || []);
  const applicants = useSelector((state) => state.applicants?.list || []);
  const company = useSelector((state) => state.company?.data || {});

  useEffect(() => {
    dispatch(fetchJobs({}));
    dispatch(fetchPostedJobs());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-indigo-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar role="employee" />

        <main className="flex-1 p-6 lg:p-10">
          {/* Dashboard Header */}
          <header className=" bg-gradient-to-br from-gray-50 via-teal-50 to-indigo-50 text-white rounded-3xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center shadow-lg">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl text-indigo-400 font-bold tracking-tight">
                Employer Dashboard
              </h1>
              <p className="text-teal-600 mt-2 text-lg">
                Welcome,{" "}
                <span className="font-semibold">{userInfo?.name}</span> 🚀
              </p>
            </div>
            <Link
              to="/empposting"
              className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out hover:bg-teal-50 hover:shadow-lg transform hover:scale-105"
            >
              Post New Job
            </Link>
          </header>

          {/* Dashboard Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Analytics Overview */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
              <BarChart className="text-teal-500 w-8 h-8 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Analytics Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-semibold text-teal-600">{postedJobs.length}</p>
                  <p className="text-gray-500">Active Postings</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-teal-600">{applicants.length}</p>
                  <p className="text-gray-500">Total Applicants</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-semibold text-teal-600">{Math.floor(Math.random() * 1000)}</p>
                  <p className="text-gray-500">Job Views</p>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
              <Briefcase className="text-indigo-500 w-8 h-8 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Job Listings
              </h2>
              <p className="text-gray-500 mb-4">{jobs.length} jobs available</p>
              <Link
                to="/joblistings"
                className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                Explore Jobs →
              </Link>
            </div>

            {/* Job Postings */}
            <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
              <PlusCircle className="text-teal-500 w-8 h-8 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Your Postings
              </h2>
              <p className="text-gray-500 mb-4">{postedJobs.length} active jobs</p>
              <Link
                to="/empposting"
                className="text-teal-600 hover:text-teal-800 font-semibold transition-colors"
              >
                Manage Jobs →
              </Link>
            </div>

            {/* Recent Applicants */}
            <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
              <Users className="text-coral-500 w-8 h-8 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Recent Applicants
              </h2>
              <p className="text-gray-500 mb-4">{applicants.length} new applicants</p>
              <Link
                to="/applicants"
                className="text-coral-600 hover:text-coral-800 font-semibold transition-colors"
              >
                Review Applicants →
              </Link>
            </div>

            {/* Company Profile */}
            <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
              <Building className="text-indigo-600 w-8 h-8 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Company Profile
              </h2>
              <p className="text-gray-500 mb-4">Update your company details</p>
              <Link
                to="/cmpprofile"
                className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                Edit Profile →
              </Link>
            </div>

            {/* Job Performance */}
            <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
              <BarChart className="text-coral-600 w-8 h-8 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Job Performance
              </h2>
              <p className="text-gray-500 mb-4">Track job views and applications</p>
              <Link
                to="/jobperformance"
                className="text-coral-600 hover:text-coral-800 font-semibold transition-colors"
              >
                View Metrics →
              </Link>
            </div>

            {/* Team Collaboration */}
            <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
              <Share2 className="text-teal-600 w-8 h-8 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Team Collaboration
              </h2>
              <p className="text-gray-500 mb-4">Manage hiring team</p>
              <Link
                to="/team"
                className="text-teal-600 hover:text-teal-800 font-semibold transition-colors"
              >
                Invite Team →
              </Link>
            </div>

            {/* Scheduled Interviews */}
            <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90">
              <Calendar className="text-indigo-500 w-8 h-8 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Scheduled Interviews
              </h2>
              <p className="text-gray-500 mb-4">0 upcoming interviews</p>
              <Link
                to="/interviews"
                className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                View Schedule →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpDashboard;