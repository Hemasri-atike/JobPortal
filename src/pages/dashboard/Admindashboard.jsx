import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admindashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in as an admin");
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error((await response.json()).error || "Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("log in")) {
          navigate("/login?type=employee");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Registered Users</h2>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mobile</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Company</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Position</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2 text-gray-600">{user.name}</td>
                    <td className="px-4 py-2 text-gray-600">{user.email}</td>
                    <td className="px-4 py-2 text-gray-600">{user.role}</td>
                    <td className="px-4 py-2 text-gray-600">{user.mobile || "-"}</td>
                    <td className="px-4 py-2 text-gray-600">{user.company_name || "-"}</td>
                    <td className="px-4 py-2 text-gray-600">{user.position || "-"}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admindashboard;