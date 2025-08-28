import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch logged-in user's resume
export const fetchResume = createAsyncThunk(
  "resume/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/resume/me"); // backend should have /me route
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch resume");
    }
  }
);

// Update logged-in user's resume
export const updateResume = createAsyncThunk(
  "resume/update",
  async (resumeData, { rejectWithValue }) => {
    try {
      const res = await axios.put("/api/resume/me", { resumeData });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update resume");
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResume.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resumeSlice.reducer;
