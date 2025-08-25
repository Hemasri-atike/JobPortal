// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null for logged-out, { role: "candidate" | "employer" | "admin", id, name } for logged-in
  const navigate = useNavigate();

  const login = (userData) => {
    setUser(userData);
    navigate(
      userData.role === "employer"
        ? "/empdashboard"
        : userData.role === "admin"
        ? "/admindashboard"
        : "/dashboard"
    );
  };

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};