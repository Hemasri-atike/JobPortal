import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch single company by ID
export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/companies/${id}`);
      // Ensure socialLinks is parsed
      const company = {
        ...res.data,
        socialLinks: typeof res.data.socialLinks === "string"
          ? JSON.parse(res.data.socialLinks)
          : res.data.socialLinks || {},
      };
      return company;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Update company
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Ensure socialLinks is stringified before sending
      if (data.socialLinks && typeof data.socialLinks !== "string") {
        data.socialLinks = JSON.stringify(data.socialLinks);
      }
      const res = await axios.put(`http://localhost:5000/api/companies/${id}`, data);
      const company = {
        ...res.data,
        socialLinks: typeof res.data.socialLinks === "string"
          ? JSON.parse(res.data.socialLinks)
          : res.data.socialLinks || {},
      };
      return company;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    company: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCompany: (state) => {
      state.company = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch company";
      })
      // Update
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update company";
      });
  },
});

export const { clearCompany } = companySlice.actions;
export default companySlice.reducer;
