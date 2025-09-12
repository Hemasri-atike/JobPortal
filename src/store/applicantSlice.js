import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch applicants for employer
export const fetchApplicants = createAsyncThunk(
  'applicants/fetchApplicants',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState(); // Assuming auth slice has token
      const res = await axios.get('http://localhost:5000/api/applications/employer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Fetch Applicants Response:", res.data);
      // Normalize response to match expected format
      return {
        applicants: Array.isArray(res.data) ? res.data : res.data.applicants || [],
        total: res.data.total || res.data.length || 0,
        page: res.data.page || 1,
        limit: res.data.limit || 8,
      };
    } catch (err) {
      console.error("Fetch Applicants Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Error fetching applicants');
    }
  }
);

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
      console.error("Update Applicant Status Error:", err.response?.data || err.message);
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
      return { id, note: res.data.note || note }; // Assume response includes the new note
    } catch (err) {
      console.error("Add Applicant Note Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || "Error adding note");
    }
  }
);

const applicantsSlice = createSlice({
  name: "applicants",
  initialState: {
    applicants: [],
    total: 0,
    page: 1,
    jobsPerPage: 8,
    statusFilter: "All",
    searchQuery: "",
    status: "idle", // Renamed from applicantsStatus for consistency
    error: null, // Renamed from applicantsError for consistency
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applicants
      .addCase(fetchApplicants.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applicants = action.payload.applicants || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.jobsPerPage = action.payload.limit || state.jobsPerPage;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch applicants";
        state.applicants = [];
      })
      // Update Applicant Status
      .addCase(updateApplicantStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id, status } = action.payload;
        const index = state.applicants.findIndex((applicant) => applicant.id === id);
        if (index !== -1) {
          state.applicants[index].status = status;
        }
      })
      .addCase(updateApplicantStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update status";
      })
      // Add Applicant Note
      .addCase(addApplicantNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addApplicantNote.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id, note } = action.payload;
        const index = state.applicants.findIndex((applicant) => applicant.id === id);
        if (index !== -1) {
          if (!state.applicants[index].notes) {
            state.applicants[index].notes = [];
          }
          state.applicants[index].notes.push(note);
        }
      })
      .addCase(addApplicantNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add note";
      });
  },
});

export const { setSearchQuery, setStatusFilter, setPage, clearError } = applicantsSlice.actions;

export default applicantsSlice.reducer;