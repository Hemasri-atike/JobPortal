// src/store/jobsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch jobs with filters, search, location, pagination
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async ({ statusFilter, searchQuery, location, page, jobsPerPage }, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs", {
        params: { status: statusFilter, search: searchQuery, location, page, limit: jobsPerPage },
      });
      return res.data; // { jobs, total, page, limit }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Server Error");
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  "jobs/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      return res.data; // [{ id, name, openPositions, icon, iconColor, bgColor }, ...]
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || "Server Error");
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    total: 0,
    status: "idle",
    error: null,
    statusFilter: "All",
    searchQuery: "",
    location: "",
    page: 1,
    jobsPerPage: 4,
    categories: [],
    categoriesStatus: "idle",
    categoriesError: null,
  },
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1;
      state.jobs = [];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
      state.jobs = [];
    },
    setLocation: (state, action) => {
      state.location = action.payload;
      state.page = 1;
      state.jobs = [];
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    clearFilters: (state) => {
      state.statusFilter = "All";
      state.searchQuery = "";
      state.location = "";
      state.page = 1;
      state.jobs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Replace jobs if page === 1; otherwise append
        if (state.page === 1) {
          state.jobs = action.payload.jobs;
        } else {
          state.jobs = [...state.jobs, ...action.payload.jobs];
        }
        state.total = action.payload.total;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.payload;
      });
  },
});

export const { setStatusFilter, setSearchQuery, setLocation, incrementPage, clearFilters } = jobsSlice.actions;
export default jobsSlice.reducer;
