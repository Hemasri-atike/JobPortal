// src/store/jobsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch jobs with filters, search, location, pagination
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async ({ statusFilter, searchQuery, location, page, jobsPerPage }, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs", {
        params: { statusFilter, searchQuery, location, page, jobsPerPage },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching jobs");
    }
  }
);

export const applyToJobThunk = createAsyncThunk(
  "jobs/applyToJob",
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        applicationData
      );
      return res.data; // e.g. { message: "Applied successfully", application }
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error applying to job");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "jobs/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      return res.data; // expecting array of categories
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching categories");
    }
  }
);


// Add Job
export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (newJob, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/jobs", newJob);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error adding job");
    }
  }
);

// Update Job
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (updatedJob, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/jobs/${updatedJob.id}`,
        updatedJob
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error updating job");
    }
  }
);

// Delete Job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error deleting job");
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    searchQuery: "",
    location: "",
    statusFilter: "all",
    page: 1,
    jobsPerPage: 5,
    
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearApplyState: (state) => {
      state.applications = [];
      state.error = null;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    decrementPage: (state) => {
      if (state.page > 1) state.page -= 1;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.location = "";
      state.statusFilter = "all";
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Job
      .addCase(addJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })

      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })

      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      });
  },
});

export const { setSearchQuery, setLocation, setStatusFilter, setPage,  incrementPage,
  decrementPage, clearFilters,clearApplyState } =
  jobsSlice.actions;

export default jobsSlice.reducer;
