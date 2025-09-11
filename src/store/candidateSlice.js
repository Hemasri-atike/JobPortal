import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch candidate by ID
export const loadCandidate = createAsyncThunk(
  "candidate/load",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { userInfo } = getState().user; // Get user info from Redux state
      const token = userInfo?.token; // Assume token is stored in userInfo
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(`http://localhost:5000/candidates/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch candidate");
      }
      const responseData = await res.json();
      if (!responseData || typeof responseData !== "object") {
        throw new Error("Invalid candidate data received");
      }
      return responseData;
    } catch (err) {
      console.error("loadCandidate error:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Save new candidate
export const saveCandidate = createAsyncThunk(
  "candidate/save",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const { userInfo } = getState().user; // Get user info from Redux state
      const token = userInfo?.token; // Assume token is stored in userInfo
      if (!token) throw new Error("No authentication token found");

      const res = await fetch("http://localhost:5000/api/candidates/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save candidate");
      }
      const responseData = await res.json();
      if (!responseData || typeof responseData !== "object") {
        throw new Error("Invalid response data");
      }
      return responseData;
    } catch (err) {
      console.error("saveCandidate error:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Update existing candidate
export const updateCandidate = createAsyncThunk(
  "candidate/update",
  async ({ formData, user_id }, { rejectWithValue, getState }) => {
    try {
      const { userInfo } = getState().user; // Get user info from Redux state
      const token = userInfo?.token; // Assume token is stored in userInfo
      if (!token) throw new Error("No authentication token found");

      const payload = new FormData();
      payload.append("user_id", user_id);
      Object.entries(formData).forEach(([key, val]) => {
        payload.append(key, val ?? "");
      });

      const res = await fetch("http://localhost:5000/candidates", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update candidate");
      }
      const responseData = await res.json();
      if (!responseData || typeof responseData !== "object") {
        throw new Error("Invalid response data");
      }
      return responseData;
    } catch (err) {
      console.error("updateCandidate error:", err.message);
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
        state.data = null; // Ensure data is reset
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
      })
      // Update candidate
      .addCase(updateCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        state.success = "Profile updated successfully";
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update candidate";
      });
  },
});

export const { clearCandidateMessages } = candidateSlice.actions;
export default candidateSlice.reducer;