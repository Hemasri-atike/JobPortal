import Sidebar from "../cvdetails/layout/Sidebar";
import Header from "../navbar/Header";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar and Dashboard Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar className="w-full lg:w-64" />

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <h4 className="text-2xl font-semibold text-gray-800 mb-6">Howdy, Jerome!!</h4>
          <p className="text-gray-600 mb-6">Ready to jump back in?</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-gray-500">Applied Jobs</div>
              <div className="text-2xl font-bold">22</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-gray-500">Job Alerts</div>
              <div className="text-2xl font-bold text-red-500">9,382</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-gray-500">Messages</div>
              <div className="text-2xl font-bold text-yellow-500">74</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-gray-500">Shortlist</div>
              <div className="text-2xl font-bold text-green-500">32</div>
            </div>
          </div>

          {/* Profile Views Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h5 className="text-lg font-semibold mb-4">Your Profile Views</h5>
            <div className="flex justify-center">
              <div className="w-full h-48">
                {/* Placeholder for chart - replace with your chart component */}
                <div className="bg-gray-200 h-full rounded">Chart Placeholder</div>
              </div>
            </div>
            <select className="mt-2 p-2 border rounded">
              <option>Last 6 Months</option>
            </select>
          </div>

          {/* Notifications */}
          {/* <div className="bg-white p-6 rounded-lg shadow">
            <h5 className="text-lg font-semibold mb-4">Notifications</h5>
            <ul className="space-y-4">
              <li className="flex items-center text-blue-600">
                <span className="mr-2">📧</span> Henry Wilson applied for a job Product Designer
              </li>
              <li className="flex items-center text-green-600">
                <span className="mr-2">📧</span> Raul Costa applied for a job Product Manager, Risk
              </li>
              <li className="flex items-center text-blue-600">
                <span className="mr-2">📧</span> Jack Milk applied for a job Technical Architect
              </li>
              <li className="flex items-center text-green-600">
                <span className="mr-2">📧</span> Michel Arianna applied for a job Software Engineer
              </li>
              <li className="flex items-center text-blue-600">
                <span className="mr-2">📧</span> Wade Warren applied for a job Web Developer
              </li>
            </ul>
          </div> */}




              <main className="flex-1 p-6">
          <h4 className="text-2xl font-semibold text-gray-800 mb-6">
            Jobs Applied Recently
          </h4>

          {/* Jobs Applied Recently Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Card 1 */}
            <div className="bg-white rounded-lg shadow p-5 flex flex-col">
              <div className="flex items-center mb-4">
                <img
                  src="/logos/segment.png"
                  alt="Segment"
                  className="w-12 h-12 rounded"
                />
                <div className="ml-4">
                  <h5 className="font-semibold text-gray-800">
                    Software Engineer (Android), Libraries
                  </h5>
                  <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                    <span>Segment</span>
                    <span>•</span>
                    <span>London, UK</span>
                    <span>•</span>
                    <span>11 hours ago</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    💰 $35k - $45k
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                      Full Time
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                      Private
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                      Urgent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="bg-white rounded-lg shadow p-5 flex flex-col">
              <div className="flex items-center mb-4">
                <img
                  src="/logos/catalyst.png"
                  alt="Catalyst"
                  className="w-12 h-12 rounded"
                />
                <div className="ml-4">
                  <h5 className="font-semibold text-gray-800">
                    Recruiting Coordinator
                  </h5>
                  <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                    <span>Catalyst</span>
                    <span>•</span>
                    <span>London, UK</span>
                    <span>•</span>
                    <span>11 hours ago</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    💰 $35k - $45k
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                      Freelancer
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                      Private
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                      Urgent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Card 3 */}
            <div className="bg-white rounded-lg shadow p-5 flex flex-col">
              <div className="flex items-center mb-4">
                <img
                  src="/logos/invision.png"
                  alt="Invision"
                  className="w-12 h-12 rounded"
                />
                <div className="ml-4">
                  <h5 className="font-semibold text-gray-800">
                    Product Manager, Studio
                  </h5>
                  <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                    <span>Invision</span>
                    <span>•</span>
                    <span>London, UK</span>
                    <span>•</span>
                    <span>11 hours ago</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    💰 $35k - $45k
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                      Part Time
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                      Private
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                      Urgent
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Card 4 */}
            <div className="bg-white rounded-lg shadow p-5 flex flex-col">
              <div className="flex items-center mb-4">
                <img
                  src="/logos/upwork.png"
                  alt="Upwork"
                  className="w-12 h-12 rounded"
                />
                <div className="ml-4">
                  <h5 className="font-semibold text-gray-800">
                    Senior Product Designer
                  </h5>
                  <div className="flex items-center text-sm text-gray-500 space-x-3 mt-1">
                    <span>Upwork</span>
                    <span>•</span>
                    <span>London, UK</span>
                    <span>•</span>
                    <span>11 hours ago</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    💰 $35k - $45k
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                      Temporary
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                      Private
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                      Urgent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;