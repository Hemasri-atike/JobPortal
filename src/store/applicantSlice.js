import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch applicants
// export const fetchApplicants = createAsyncThunk(
//   "applicants/fetchApplicants",
//   async ({ statusFilter, searchQuery, page, jobsPerPage }, { rejectWithValue }) => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/applicants", {
//         params: { status: statusFilter, search: searchQuery, page, limit: jobsPerPage },
//       });
//       console.log("API Response:", res.data); // Debug log
//       // Normalize response
//       const data = res.data;
//       return {
//         applicants: Array.isArray(data.applicants)
//           ? data.applicants
//           : Array.isArray(data)
//           ? data
//           : [],
//         total: data.total || (Array.isArray(data.applicants) ? data.applicants.length : data.length || 0),
//         page: data.page || page,
//         limit: data.limit || jobsPerPage,
//       };
//     } catch (err) {
//       console.error("Fetch Applicants Error:", err.response?.data || err.message);
//       return rejectWithValue(err.response?.data?.message || "Error fetching applicants");
//     }
//   }
// );

// Update applicant status
export const updateApplicantStatus = createAsyncThunk(
  "applicants/updateApplicantStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const { auth: { token } } = getState();
      const res = await axios.put(
        `http://localhost:5000/api/applicants/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { id, status };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error updating status");
    }
  }
);

// Add note to applicant
export const addApplicantNote = createAsyncThunk(
  "applicants/addApplicantNote",
  async ({ id, note }, { rejectWithValue, getState }) => {
    try {
      const { auth: { token } } = getState();
      const res = await axios.post(
        `http://localhost:5000/api/applicants/${id}/notes`,
        { note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { id, note };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error adding note");
    }
  }
);




// In a new applicantsSlice.js or add to jobsSlice
export const fetchApplicants = createAsyncThunk(
  'applicants/fetchApplicants',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState(); // For employer auth
      const res = await axios.get('http://localhost:5000/api/applications/employer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data; // Array of applicants
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching applicants');
    }
  }
);
// Add to extraReducers: similar to fetchJobs.

const applicantSlice = createSlice({
  name: "applicants",
  initialState: {
    applicants: [],
    total: 0,
    page: 1,
    jobsPerPage: 8,
    statusFilter: "All",
    searchQuery: "",
    applicantsStatus: "idle",
    applicantsError: null,
  },
  reducers: {
    setApplicantSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setApplicantStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setApplicantPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicants.pending, (state) => {
        state.applicantsStatus = "loading";
        state.applicantsError = null;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.applicantsStatus = "succeeded";
        state.applicants = action.payload.applicants || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.jobsPerPage = action.payload.limit || state.jobsPerPage;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.applicantsStatus = "failed";
        state.applicantsError = action.payload;
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.applicants.findIndex((applicant) => applicant.id === id);
        if (index !== -1) {
          state.applicants[index].status = status;
        }
      })
      .addCase(addApplicantNote.fulfilled, (state, action) => {
        const { id, note } = action.payload;
        const index = state.applicants.findIndex((applicant) => applicant.id === id);
        if (index !== -1) {
          state.applicants[index].notes = [...(state.applicants[index].notes || []), note];
        }
      });
  },
});

export const { setApplicantSearchQuery, setApplicantStatusFilter, setApplicantPage } =
  applicantSlice.actions;

export default applicantSlice.reducer;