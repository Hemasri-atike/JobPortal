import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Axios instance with optional auth token
const axiosAuth = (token) =>
  axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
    },
    timeout: 10000,
  });

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const axiosInstance = token ? axiosAuth(token) : axios;

      const res = await axiosInstance.get('/categories/getCategories');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Error fetching categories');
    }
  }
);

// Fetch subcategories based on category name
export const fetchSubcategories = createAsyncThunk(
  'categories/fetchSubcategories',
  async (categoryName, { getState, rejectWithValue }) => {
    try {
      if (!categoryName) return rejectWithValue('Invalid category name');

      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const axiosInstance = token ? axiosAuth(token) : axios;

      const res = await axiosInstance.get('/subcategories', {
        params: { category_name: categoryName },
      });

      return Array.isArray(res.data.subcategories) ? res.data.subcategories : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Error fetching subcategories');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    subcategories: [],
    status: 'idle',
    subcategoriesStatus: 'idle',
    error: null,
    subcategoriesError: null,
  },
  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    resetSubcategories: (state) => {
      state.subcategories = [];
      state.subcategoriesStatus = 'idle';
      state.subcategoriesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Subcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.subcategoriesStatus = 'loading';
        state.subcategoriesError = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategoriesStatus = 'succeeded';
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.subcategoriesStatus = 'failed';
        state.subcategoriesError = action.payload;
      });
  },
});

export const { addCategory, resetSubcategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
