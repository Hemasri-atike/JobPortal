import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Load profile from localStorage (on page refresh)
export const loadProfile = createAsyncThunk("profile/load", async () => {
  const savedProfile = localStorage.getItem("candidateProfile");
  return savedProfile ? JSON.parse(savedProfile) : null;
});

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.data = action.payload;
      localStorage.setItem("candidateProfile", JSON.stringify(action.payload));
    },
    updateProfile: (state, action) => {
      state.data = { ...state.data, ...action.payload };
      localStorage.setItem("candidateProfile", JSON.stringify(state.data));
    },
    clearProfile: (state) => {
      state.data = null;
      localStorage.removeItem("candidateProfile");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setProfile, updateProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
