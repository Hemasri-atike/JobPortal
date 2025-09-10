// src/store/categoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const axiosAuth = (token) =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Use Vite env variable
    headers: { Authorization: `Bearer ${token}` },
    timeout: 10000,
  });
// Fetch categories from backend
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
    async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      console.log("s",user)

      const token = user.userInfo?.token || localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const res =await axiosAuth(token).get("/categories/getCategories");
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
