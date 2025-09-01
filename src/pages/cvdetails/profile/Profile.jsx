import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, clearMessages } from "../../../store/profileSlice.js";
import Sidebar from "../layout/Sidebar.jsx";
import Header from "../../navbar/Header.jsx";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize navigate

  const { profile, loading, error, success } = useSelector(
    (state) => state.profile
  );
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo?.role === "job_seeker") {
      dispatch(fetchProfile());
    }
    return () => dispatch(clearMessages());
  }, [dispatch, userInfo]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ✅ Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          role={userInfo?.role === "employee" ? "employee" : "candidate"}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-64">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Candidate Profile</h2>

            {/* ✅ Add Button */}
            <button
              onClick={() => navigate("/caddetails")} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>

          {success && <p className="text-green-500 mb-2">{success}</p>}

          <div className="bg-white p-6 rounded-lg shadow space-y-2">
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Mobile:</strong> {profile.mobile}
            </p>
            {/* <p>
              <strong>Company:</strong> {profile.company_name || "-"}
            </p>
            <p>
              <strong>Role:</strong> {profile.role}
            </p> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
