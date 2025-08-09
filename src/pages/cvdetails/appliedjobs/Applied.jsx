
import Header from '../../navbar/Header';
import Sidebar from "../layout/Sidebar"

const Applied = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - collapses on small screens */}
        <div className="hidden md:block w-64 bg-gray-100 ">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Applied</h2>
          <p>Your applied jobs will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Applied;
