import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔹 Helper to safely read from localStorage
const getStoredUserInfo = () => {
  try {
    const stored = localStorage.getItem("userInfo");
    return stored && stored !== "undefined" ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredUserType = () => {
  try {
    const storedType = localStorage.getItem("userType");
    if (storedType) return storedType;
    const storedUser = localStorage.getItem("userInfo");
    return storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)?.role
      : null;
  } catch {
    return null;
  }
};

// 🔹 Register User
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

      // Save token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("userType", data.user.role);

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Login User (mobile + password)
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ mobile, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      // Save token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("userType", data.user.role);

      return data.user; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Initial state
const initialState = {
  userInfo: getStoredUserInfo(),
  userType: getStoredUserType(),
  isLoading: false,
  error: null,
};

// 🔹 Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.userInfo = null;
      state.userType = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userType");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.userType = action.payload.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.userType = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
