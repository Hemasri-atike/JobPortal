import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch applicants
export const fetchApplicants = createAsyncThunk(
  "applicants/fetchApplicants",
  async ({ statusFilter, searchQuery, page, jobsPerPage }, { rejectWithValue }) => {
    try {
      const params = { page, limit: jobsPerPage };
      if (statusFilter !== "All") params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await axios.get("http://localhost:5000/api/applicants", { params });
      return {
        applicants: Array.isArray(res.data.applicants) ? res.data.applicants : [],
        total: res.data.total || 0,
        page: res.data.page || page,
        limit: res.data.limit || jobsPerPage,
      };
    } catch (err) {
      const errorMessage = err.response?.data?.details || err.message || "Error fetching applicants";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update applicant status
export const updateApplicantStatus = createAsyncThunk(
  "applicants/updateApplicantStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/applicants/${id}/status`, { status });
      return { id, status };
    } catch (err) {
      const errorMessage = err.response?.data?.details || err.message || "Error updating status";
      return rejectWithValue(errorMessage);
    }
  }
);

// Add note to applicant
export const addApplicantNote = createAsyncThunk(
  "applicants/addApplicantNote",
  async ({ id, note }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/applicants/${id}/notes`, { note });
      return { id, note: res.data.note || note };
    } catch (err) {
      const errorMessage = err.response?.data?.details || err.message || "Error adding note";
      return rejectWithValue(errorMessage);
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
    status: "idle",
    error: null,
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
        toast.success(config.messages.success.statusUpdate);
      })
      .addCase(updateApplicantStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update status";
        toast.error(config.messages.error.statusUpdate(action.payload || "Failed to update status"));
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
        toast.success(config.messages.success.noteAdded);
      })
      .addCase(addApplicantNote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add note";
        toast.error(config.messages.error.noteFailed(action.payload || "Failed to add note"));
      });
  },
});

export const { setSearchQuery, setStatusFilter, setPage, clearError } = applicantsSlice.actions;
export default applicantsSlice.reducer;