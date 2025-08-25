// store/footerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch footer data
export const fetchFooter = createAsyncThunk(
  "footer/fetchFooter",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/footer"); 
      return response.data; // API returns { data: { candidates, employers, about } }
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

        const apiData = action.payload.data; // <-- extract 'data' from API response

        // Transform backend data into structure expected by Footer component
        state.data = {
          cta: {
            title: "Find Your Dream Job Today",
            subtitle: "Explore jobs and apply with one click!",
            ctaText: "Browse Jobs",
            ctaLink: "/jobs",
          },
          companyInfo: {
            phone: "+91 1234567890",
            address: "123 Main Street, India",
            email: "info@ihire.com",
          },
          sections: {
            candidates: apiData.candidates || [],
            employers: apiData.employers || [],
            about: apiData.about || [],
          },
          bottomLinks: [
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Terms of Service", path: "/terms" },
          ],
        };
      })
      .addCase(fetchFooter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default footerSlice.reducer;
