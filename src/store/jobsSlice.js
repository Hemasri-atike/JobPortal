import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch jobs (existing)
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ statusFilter, searchQuery, page, jobsPerPage }, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        params: { status: statusFilter, search: searchQuery, page, limit: jobsPerPage },
      });
      return res.data; // { jobs, total, page, limit }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Server Error');
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'jobs/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      return res.data; // Expected: [{ id, name, openPositions, icon, iconColor, bgColor }, ...]
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Server Error');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    total: 0,
    status: 'idle',
    error: null,
    statusFilter: 'All',
    searchQuery: '',
    page: 1,
    jobsPerPage: 4,
    categories: [],
    categoriesStatus: 'idle',
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
    incrementPage: (state) => {
      state.page += 1;
    },
    clearFilters: (state) => {
      state.statusFilter = 'All';
      state.searchQuery = '';
      state.page = 1;
      state.jobs = [];
    },
  },
  extraReducers: (builder) => {
    // Existing jobs reducers
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = [...state.jobs, ...action.payload.jobs];
        state.total = action.payload.total;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Categories reducers
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.payload;
      });
  },
});

export const { setStatusFilter, setSearchQuery, incrementPage, clearFilters } = jobsSlice.actions;
export default jobsSlice.reducer;