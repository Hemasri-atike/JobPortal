// src/api/employeeApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/employee";

// Save full profile
export const saveEmployeeProfile = async (employee) => {
  const res = await axios.post(API_URL, employee);
  return res.data;
};

// Upload Resume
export const uploadResume = async (id, file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const res = await axios.post(`${API_URL}/upload-resume/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Add Skill
export const addSkill = async (id, skill) => {
  const res = await axios.post(`${API_URL}/${id}/skills`, { skill_name: skill });
  return res.data;
};

// Add Certification
export const addCertification = async (id, cert) => {
  const res = await axios.post(`${API_URL}/${id}/certifications`, cert);
  return res.data;
};
