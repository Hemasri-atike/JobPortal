// src/store/postingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch jobs posted by the logged-in employee
export const fetchPostedJobs = createAsyncThunk(
  "postedJobs/fetchPostedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/posted");
      return res.data; // Expecting an array of jobs
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching posted jobs");
    }
  }
);

const postingSlice = createSlice({
  name: "postedJobs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPostedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postingSlice.reducer;
