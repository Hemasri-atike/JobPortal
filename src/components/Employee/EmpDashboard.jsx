import { Briefcase, PlusCircle, Users, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Header from "../../pages/navbar/Header";
import Sidebar from "../../pages/cvdetails/layout/Sidebar";
import { fetchJobs } from "../../store/jobsSlice.js";
// import { fetchPostedJobs } from "../../store/postingSlice";
// import { fetchApplicants } from "../../store/applicantSlice";
// import { fetchCompany } from "../../store/companySlice";

const EmpDashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  // const { list: jobs } = useSelector((state) => state.jobs);
  // const { list: postedJobs } = useSelector((state) => state.postedJobs);
  // const { list: applicants } = useSelector((state) => state.applicants);
  // const { data: company } = useSelector((state) => state.company);

  const jobs = useSelector((state) => state.jobs?.list || []);
const postedJobs = useSelector((state) => state.postedJobs?.list || []);
const applicants = useSelector((state) => state.applicants?.list || []);
const company = useSelector((state) => state.company?.data || {});


  useEffect(() => {
    // dispatch(fetchJobs());
    // dispatch(fetchPostedJobs());
    // dispatch(fetchApplicants());
    // dispatch(fetchCompany());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar role="employee" />

        <main className="flex-1 flex flex-col p-4 md:p-6">
          {/* Dashboard Header */}
          <header className="flex flex-col md:flex-row justify-between items-center bg-white shadow rounded-lg p-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome <span className="font-semibold text-blue-600">{userInfo?.name}</span> 👋
              </p>
            </div>
            <Link to="/empposting" className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Post a Job
            </Link>
          </header>

          {/* Dashboard Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Job Listings */}
            <div className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition">
              <Briefcase className="text-blue-500 w-10 h-10 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Job Listings</h2>
              <p className="text-gray-600 mb-4">
                {jobs.length} jobs available in the system
              </p>
              <Link to="/joblistings" className="text-blue-600 hover:underline">View Jobs →</Link>
            </div>

            {/* Job Postings */}
            <div className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition">
              <PlusCircle className="text-green-500 w-10 h-10 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Job Postings</h2>
              <p className="text-gray-600 mb-4">{postedJobs.length} jobs you posted</p>
              <Link to="/empposting" className="text-green-600 hover:underline">Manage Postings →</Link>
            </div>

            {/* Applicants */}
            <div className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition">
              <Users className="text-purple-500 w-10 h-10 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Applicants Management</h2>
              <p className="text-gray-600 mb-4">{applicants.length} applicants applied</p>
              <Link to="/applicants" className="text-purple-600 hover:underline">View Applicants →</Link>
            </div>

            {/* Company Profile */}
            <div className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition">
              <Building className="text-orange-500 w-10 h-10 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Company Profile</h2>
              <p className="text-gray-600 mb-4">Update your company info</p>
              <Link to="/cmpprofile" className="text-orange-600 hover:underline">Edit Profile →</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpDashboard;
