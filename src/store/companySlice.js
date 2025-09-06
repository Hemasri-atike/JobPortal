import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/companies";

// Fetch profile
export const fetchCompanyProfile = createAsyncThunk(
  "company/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return rejectWithValue(null); // No profile exists
      }
      if (err.response?.status === 401) {
        return rejectWithValue("Unauthorized access. Please log in again.");
      }
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch company profile"
      );
    }
  }
);

// Save profile (create/update)
export const saveCompanyProfile = createAsyncThunk(
  "company/saveProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const res = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // Fetch updated profile to ensure state consistency
      const profileRes = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...res.data, profile: profileRes.data };
    } catch (err) {
      if (err.response?.status === 400) {
        return rejectWithValue(
          err.response?.data?.error || "Invalid data provided"
        );
      }
      if (err.response?.status === 401) {
        return rejectWithValue("Unauthorized access. Please log in again.");
      }
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.details ||
          "Failed to save company profile"
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
    clearCompanySuccess: (state) => {
      state.success = false;
    },
    resetCompanyState: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save
      .addCase(saveCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.success = true;
      })
      .addCase(saveCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearCompanyError, clearCompanySuccess, resetCompanyState } =
  companySlice.actions;
export default companySlice.reducer;