// src/store/categoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch categories from backend
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      return res.data; // expected array of categories
    } catch (err) {
      // Ensure a string error is returned
      if (err.response?.data?.error) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue(err.message || "Error fetching categories");
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,    // always a string or null
  },
  reducers: {
    // Optional: add local category if you want
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch categories";
      });
  },
});

export const { addCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
