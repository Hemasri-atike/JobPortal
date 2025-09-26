import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosAuth = (token) =>
  axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
    },
    timeout: 10000,
  });

// Fetch categories from backend
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const axiosInstance = token ? axiosAuth(token) : axios; // Use axiosAuth if token exists
      const res = await axiosInstance.get('http://localhost:5000/api/categories/getCategories');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Error fetching categories');
    }
  }
);

// Fetch subcategories for a specific category
export const fetchSubcategories = createAsyncThunk(
  'categories/fetchSubcategories',
  async (categoryId, { getState, rejectWithValue }) => {
    try {
      if (!categoryId || isNaN(parseInt(categoryId))) {
        return rejectWithValue('Invalid category ID');
      }
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      const axiosInstance = token ? axiosAuth(token) : axios;
      const res = await axiosInstance.get('http://localhost:5000/api/subcategories', {
        params: { category_id: parseInt(categoryId) },
      });
      return Array.isArray(res.data) ? res.data : res.data.subcategories || [];
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