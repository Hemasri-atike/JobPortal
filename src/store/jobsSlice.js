import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch jobs from backend
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
      });
  },
});

export const { setStatusFilter, setSearchQuery, incrementPage, clearFilters } = jobsSlice.actions;
export default jobsSlice.reducer;
