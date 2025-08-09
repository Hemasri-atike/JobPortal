
import Header from "../../navbar/Header";
import Sidebar from "../layout/Sidebar"; // Import previous Sidebar

const JobAlert = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar (hidden on small screens) */}
        <div className="hidden md:block w-64 bg-gray-100 ">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">Alerts</h3>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <p className="text-gray-700">
              Your job alerts will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAlert;
