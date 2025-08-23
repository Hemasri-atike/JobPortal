import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const withAuth = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Fetch profile from backend
export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/api/profile/me", {
        method: "GET",
        ...withAuth(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
      // Save to localStorage for persistence
      localStorage.setItem("candidateProfile", JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
      });
  },
});

export const { setProfile, updateProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
