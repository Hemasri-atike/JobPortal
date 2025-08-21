import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Load profile from localStorage (simulate backend for now)
export const loadProfile = createAsyncThunk("profile/load", async () => {
  const savedProfile = localStorage.getItem("candidateProfile");
  if (savedProfile) {
    return JSON.parse(savedProfile);
  }
  return {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 9876543210",
    designation: "Senior Software Engineer",
    company: "Tech Solutions Pvt Ltd",
    location: "Hyderabad, India",
    about:
      "Passionate software engineer with 5+ years of experience in full-stack development and team management.",
  };
});

// ✅ Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateProfile: (state, action) => {
      state.data = { ...state.data, ...action.payload };
      localStorage.setItem("candidateProfile", JSON.stringify(state.data));
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

export const { updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
