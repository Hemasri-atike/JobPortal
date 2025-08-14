import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Download, FileText } from 'lucide-react';
import Sidebar from "../cvdetails/layout/Sidebar";
import Header from "../navbar/Header";

const Dashboard = () => {
  const [profileCompletion] = useState(75); // Example: 75% complete
  const [notifications] = useState([
    { id: 1, message: "Henry Wilson applied for Product Designer", type: "application", color: "text-blue-600" },
    { id: 2, message: "Raul Costa sent you an interview invitation", type: "invitation", color: "text-green-600" },
    { id: 3, message: "Jack Milk downloaded your resume", type: "download", color: "text-yellow-600" },
    { id: 4, message: "Michel Arianna applied for Software Engineer", type: "application", color: "text-blue-600" },
    { id: 5, message: "Wade Warren shortlisted you for Web Developer", type: "shortlist", color: "text-green-600" },
  ]);

  const jobs = [
    {
      id: 1,
      title: "Software Engineer (Android), Libraries",
      company: "Segment",
      logo: "/logos/segment.png",
      location: "London, UK",
      time: "11 hours ago",
      salary: "$35k - $45k",
      tags: ["Full Time", "Private", "Urgent"],
      status: "Under Review",
      recruiterActions: { invitationSent: true, resumeDownloaded: true },
    },
    {
      id: 2,
      title: "Recruiting Coordinator",
      company: "Catalyst",
      logo: "/logos/catalyst.png",
      location: "London, UK",
      time: "11 hours ago",
      salary: "$35k - $45k",
      tags: ["Freelancer", "Private", "Urgent"],
      status: "Shortlisted",
      recruiterActions: { invitationSent: false, resumeDownloaded: true },
    },
    {
      id: 3,
      title: "Product Manager, Studio",
      company: "Invision",
      logo: "/logos/invision.png",
      location: "London, UK",
      time: "11 hours ago",
      salary: "$35k - $45k",
      tags: ["Part Time", "Private", "Urgent"],
      status: "Interview Scheduled",
      recruiterActions: { invitationSent: true, resumeDownloaded: false },
    },
    {
      id: 4,
      title: "Senior Product Designer",
      company: "Upwork",
      logo: "/logos/upwork.png",
      location: "London, UK",
      time: "11 hours ago",
      salary: "$35k - $45k",
      tags: ["Temporary", "Private", "Urgent"],
      status: "Applied",
      recruiterActions: { invitationSent: false, resumeDownloaded: false },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar and Dashboard Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar className="w-full lg:w-64" />

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6">
          <h4 className="text-2xl font-semibold text-gray-800 mb-4">Welcome Hari!</h4>
          <p className="text-gray-600 mb-6">Ready to jump back in?</p>

          {/* Profile Completion Meter */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h5 className="text-lg font-semibold text-gray-800 mb-2">Profile Completion</h5>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Your profile is {profileCompletion}% complete.{' '}
              <Link to="/profile" className="text-blue-600 hover:underline">
                Complete your profile
              </Link>
              {' '}to improve visibility!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Link to="/applied-jobs" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="text-gray-500">Applied Jobs</div>
              <div className="text-2xl font-bold text-gray-800">22</div>
            </Link>
            <Link to="/shortlisted-jobs" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="text-gray-500">Shortlisted</div>
              <div className="text-2xl font-bold text-green-500">32</div>
            </Link>
            <Link to="/recruiter-actions" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="text-gray-500">Recruiter Actions</div>
              <div className="text-2xl font-bold text-yellow-500">15</div>
            </Link>
            <Link to="/messages" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="text-gray-500">Messages</div>
              <div className="text-2xl font-bold text-blue-500">74</div>
            </Link>
          </div>

          {/* Profile Views Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-800">Your Profile Views</h5>
              <select className="p-2 border rounded text-sm text-gray-600">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="flex justify-center">
              <div className="w-full h-48">
                {/* Placeholder for chart - replace with your chart component */}
                <div className="bg-gray-200 h-full rounded flex items-center justify-center text-gray-500">
                  Chart Placeholder (Profile Views)
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h5 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h5>
            <ul className="space-y-4" aria-live="polite">
              {notifications.map((notification) => (
                <li key={notification.id} className={`flex items-center ${notification.color}`}>
                  <span className="mr-2">
                    {notification.type === "invitation" && <Mail size={16} />}
                    {notification.type === "download" && <Download size={16} />}
                    {notification.type === "shortlist" && <FileText size={16} />}
                    {notification.type === "application" && <FileText size={16} />}
                  </span>
                  {notification.message}
                </li>
              ))}
            </ul>
            <Link to="/notifications" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
              View All Notifications <ChevronRight size={16} className="inline" />
            </Link>
          </div>

          {/* Jobs Applied Recently */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h5 className="text-lg font-semibold text-gray-800 mb-4">Jobs Applied Recently</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow p-5 flex flex-col">
                  <div className="flex items-center mb-4">
                    <img src={job.logo} alt={job.company} className="w-12 h-12 rounded" />
                    <div className="ml-4 flex-1">
                      <h6 className="font-semibold text-gray-800">{job.title}</h6>
                      <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                        <span>{job.company}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        💰 {job.salary}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1 text-xs rounded-full ${
                              tag === "Full Time"
                                ? "bg-blue-100 text-blue-600"
                                : tag === "Freelancer"
                                ? "bg-purple-100 text-purple-600"
                                : tag === "Part Time"
                                ? "bg-indigo-100 text-indigo-600"
                                : tag === "Temporary"
                                ? "bg-pink-100 text-pink-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {tag}
                          </span>
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
                      <span className="text-green-600">Invitation Sent </span>
                    )}
                    {job.recruiterActions.resumeDownloaded && (
                      <span className="text-yellow-600">Resume Downloaded</span>
                    )}
                    {!job.recruiterActions.invitationSent && !job.recruiterActions.resumeDownloaded && (
                      <span>No actions yet</span>
                    )}
                  </div>
                  <Link
                    to={`/job/${job.id}`}
                    className="mt-2 text-blue-600 hover:underline text-sm"
                  >
                    View Details <ChevronRight size={16} className="inline" />
                  </Link>
                </div>
              ))}
            </div>
            <Link to="/applied-jobs" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
              View All Applied Jobs <ChevronRight size={16} className="inline" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;