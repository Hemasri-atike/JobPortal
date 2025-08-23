// store/footerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch footer data
export const fetchFooter = createAsyncThunk(
  "footer/fetchFooter",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/footer");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const footerSlice = createSlice({
  name: "footer",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFooter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchFooter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default footerSlice.reducer;
