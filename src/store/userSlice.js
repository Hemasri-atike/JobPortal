import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 Async thunk for user registration
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");

      // Save token and user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      // Save token and user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.userInfo = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 🔹 Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Export actions and reducer
export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
