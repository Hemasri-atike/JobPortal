import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCandidate, clearCandidateMessages } from "../../../store/candidateSlice.js";

const Profile = () => {
  const dispatch = useDispatch();
  const { data, loading, error, success } = useSelector((state) => state.candidate);
  const { userInfo } = useSelector((state) => state.user); // logged-in user info

  useEffect(() => {
    if (userInfo?.id && userInfo.role === "candidate") {
      dispatch(loadCandidate(userInfo.id));
    }
    return () => dispatch(clearCandidateMessages()); // clear errors/messages on unmount
  }, [dispatch, userInfo]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>No profile found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Candidate Profile</h2>
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <div className="bg-white p-6 rounded-lg shadow space-y-2">
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Mobile:</strong> {data.mobile}</p>
        <p><strong>Company:</strong> {data.company_name || "-"}</p>
        <p><strong>Role:</strong> {data.role}</p>
      </div>
    </div>
  );
};

export default Profile;
