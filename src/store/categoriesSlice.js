import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosAuth = (token) =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
      if (!token) {
        throw new Error('No authentication token found');
      }
      const res = await axiosAuth(token).get('/categories/getCategories');
      return res.data;
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
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      // Public endpoint, token optional
      const res = await axios.get('http://localhost:5000/api/subcategories', {
        params: { category_id: categoryId },
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Cache-Control': 'no-cache',
        },
      });
      return res.data.subcategories || [];
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

export const { addCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;