// src/store/resumeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5000/api/candidates/resume';

// Named exports
export const fetchResume = createAsyncThunk('resume/fetchResume', async () => {
  const res = await fetch(`${BASE_URL}/resume`);
  if (!res.ok) throw new Error('Failed to fetch resume');
  return await res.json();
});

export const updateResume = createAsyncThunk('resume/updateResume', async (resumeData) => {
  const res = await fetch(`${BASE_URL}/resume`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resumeData),
  });
  if (!res.ok) throw new Error('Failed to update resume');
  return await res.json();
});

const resumeSlice = createSlice({
  name: 'resume',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResume.pending, (state) => { state.loading = true; })
      .addCase(fetchResume.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchResume.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updateResume.pending, (state) => { state.loading = true; })
      .addCase(updateResume.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(updateResume.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default resumeSlice.reducer;
