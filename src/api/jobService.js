import api from "./Axios.js";

export const createJob = async (jobData) => {
  return await api.post("/jobs", jobData); // employer only
};

export const getJobs = async () => {
  return await api.get("/jobs");
};

export const getJobById = async (id) => {
  return await api.get(`/jobs/${id}`);
};
