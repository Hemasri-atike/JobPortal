import api from "./Axios.js";

export const register = async (userData) => {
  return await api.post("/users/register", userData);
};

export const login = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
