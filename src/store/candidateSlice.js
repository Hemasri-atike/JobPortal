import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch candidate by ID
export const loadCandidate = createAsyncThunk(
  "candidate/load",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5000/candidate/${id}`);
      if (!res.ok) throw new Error("Failed to fetch candidate");
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Save candidate (insert/update)
export const saveCandidate = createAsyncThunk(
  "candidate/save",
  async (formData, { rejectWithValue }) => {
    try {
      const data = new FormData();
      for (let key in formData) {
        if (formData[key] !== null) data.append(key, formData[key]);
      }
      const res = await fetch("http://localhost:5000/candidate", {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("Failed to save candidate");
      const result = await res.json();
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const candidateSlice = createSlice({
  name: "candidate",
  initialState: {
    data: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearCandidateMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load candidate
      .addCase(loadCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loadCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load candidate";
      })

      // Save candidate
      .addCase(saveCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(saveCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        state.success = "Profile saved successfully";
      })
      .addCase(saveCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save candidate";
      });
  },
});

export const { clearCandidateMessages } = candidateSlice.actions;
export default candidateSlice.reducer;
