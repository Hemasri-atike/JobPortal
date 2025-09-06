import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch jobs
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ statusFilter, searchQuery, location, page, jobsPerPage }, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        params: { status: statusFilter, search: searchQuery, location, page, limit: jobsPerPage },
      });
    
      return res.data;
    } catch (err) {
   
      return rejectWithValue(err.response?.data?.message || 'Error fetching jobs');
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'jobs/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs/categories');
  
      return res.data;
    } catch (err) {
    
      return rejectWithValue(err.response?.data?.message || 'Error fetching categories');
    }
  }
);

// Fetch jobs by category
export const fetchJobsByCategory = createAsyncThunk(
  'jobs/fetchJobsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs/by-category', {
        params: { category },
      });
     
      return res.data;
    } catch (err) {
    
      return rejectWithValue(err.response?.data?.message || 'Error fetching jobs by category');
    }
  }
);




// Fetch user applications
export const fetchUserApplications = createAsyncThunk(
  'jobs/fetchUserApplications',
  async (candidateId, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications', {
        params: { candidate_id: candidateId },
      });
    
      return res.data.map((app) => app.job_id);
    } catch (err) {
    
      return rejectWithValue(err.response?.data?.message || 'Error fetching applications');
    }
  }
);

// Add job
export const addJob = createAsyncThunk(
  'jobs/addJob',
  async (jobData, { rejectWithValue, getState }) => {
    try {
      const { auth: { token } } = getState();
      const res = await axios.post(
        'http://localhost:5000/api/jobs',
        jobData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      return { jobId: res.data.jobId, job: jobData };
    } catch (err) {
   
      return rejectWithValue(err.response?.data?.message || 'Error creating job');
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, { rejectWithValue, getState }) => {
    try {
      const { auth: { token } } = getState();
      const res = await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        jobData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      return { id, ...jobData };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error updating job');
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth: { token } } = getState();
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
   
      return rejectWithValue(err.response?.data?.message || 'Error deleting job');
    }
  }
);


export const applyToJobThunk = createAsyncThunk(
  'jobs/applyToJob',
  async (applicationData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('fullName', applicationData.name); // Match backend field
      formData.append('email', applicationData.email);
      formData.append('phone', applicationData.phone);
      formData.append('location', applicationData.location);
      formData.append('experience', applicationData.experience);
      formData.append('jobTitle', applicationData.jobTitle);
      formData.append('company', applicationData.company);
      formData.append('qualification', applicationData.qualification);
      formData.append('specialization', applicationData.specialization);
      formData.append('university', applicationData.university);
      formData.append('skills', applicationData.skills);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('linkedIn', applicationData.linkedIn);
      formData.append('portfolio', applicationData.portfolio);
      formData.append('job_id', applicationData.job_id); // Include job_id
      formData.append('candidate_id', applicationData.candidate_id); // Include candidate_id
      formData.append('status', 'applied');
      formData.append('resume', applicationData.resume); // File object

      const response = await axios.post(
        'http://localhost:5000/api/applications', // Correct endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
    
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    applying: false,
    applyError: null,
    applySuccess: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(applyToJobThunk.pending, (state) => {
        state.applying = true;
        state.applyError = null;
        state.applySuccess = null;
      })
      .addCase(applyToJobThunk.fulfilled, (state, action) => {
        state.applying = false;
        state.applySuccess = action.payload;
      })
      .addCase(applyToJobThunk.rejected, (state, action) => {
        state.applying = false;
        state.applyError = action.payload;
      });
  },
});





const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    total: 0,
    page: 1,
    jobsPerPage: 8,
    searchQuery: '',
    location: '',
    statusFilter: 'all',
    jobsStatus: 'idle',
    jobsError: null,
    categories: [],
    categoriesStatus: 'idle',
    categoriesError: null,
    jobsByCategory: [],
    applications: [],
    applicationsData: [],
    loadingApply: false,
    errorApply: null,
    successApply: false,
    addJobStatus: 'idle',
    addJobError: null,
    addJobSuccess: false,
    updateJobStatus: 'idle',
    updateJobError: null,
    updateJobSuccess: false,
    deleteJobStatus: 'idle',
    deleteJobError: null,
    deleteJobSuccess: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
      state.page = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    decrementPage: (state) => {
      if (state.page > 1) state.page -= 1;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.location = '';
      state.statusFilter = 'all';
      state.page = 1;
    },
    clearApplyState: (state) => {
      state.loadingApply = false;
      state.errorApply = null;
      state.successApply = false;
      state.applications = [];
    },
    clearAddJobState: (state) => {
      state.addJobStatus = 'idle';
      state.addJobError = null;
      state.addJobSuccess = false;
    },
    clearUpdateJobState: (state) => {
      state.updateJobStatus = 'idle';
      state.updateJobError = null;
      state.updateJobSuccess = false;
    },
    clearDeleteJobState: (state) => {
      state.deleteJobStatus = 'idle';
      state.deleteJobError = null;
      state.deleteJobSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
   
        // Normalize payload into jobs array
        if (Array.isArray(action.payload)) {
          state.jobs = action.payload;
          state.total = action.payload.length;
        } else if (action.payload && Array.isArray(action.payload.jobs)) {
          state.jobs = action.payload.jobs;
          state.total = action.payload.total || action.payload.jobs.length;
        } else {
        
          state.jobs = [];
          state.total = 0;
        }
        state.page = action.payload.page || 1;
        state.jobsPerPage = action.payload.limit || state.jobsPerPage;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
     
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload || [];
        
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.payload || 'Failed to fetch categories';
     
      })
      // Fetch Jobs by Category
      .addCase(fetchJobsByCategory.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchJobsByCategory.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.jobsByCategory = action.payload.jobs || [];
      
      })
      .addCase(fetchJobsByCategory.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;

      })
      // Apply to Job
      .addCase(applyToJobThunk.pending, (state) => {
        state.loadingApply = true;
        state.errorApply = null;
        state.successApply = false;
      })
      .addCase(applyToJobThunk.fulfilled, (state, action) => {
        state.loadingApply = false;
        state.successApply = true;
        state.applications = [...new Set([...state.applications, action.payload.jobId])];
       
      })
      .addCase(applyToJobThunk.rejected, (state, action) => {
        state.loadingApply = false;
        state.errorApply = action.payload;
      
      })
      // Fetch User Applications
      .addCase(fetchUserApplications.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.applications = action.payload;
      
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
    
      })
      // Add Job
      .addCase(addJob.pending, (state) => {
        state.addJobStatus = 'loading';
        state.addJobError = null;
        state.addJobSuccess = false;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.addJobStatus = 'succeeded';
        state.addJobSuccess = true;
        state.jobs = [...state.jobs, { id: action.payload.jobId, ...action.payload.job }];
       
      })
      .addCase(addJob.rejected, (state, action) => {
        state.addJobStatus = 'failed';
        state.addJobError = action.payload;
    
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.updateJobStatus = 'loading';
        state.updateJobError = null;
        state.updateJobSuccess = false;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.updateJobStatus = 'succeeded';
        state.updateJobSuccess = true;
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = { ...state.jobs[index], ...action.payload };
        }
       
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.updateJobStatus = 'failed';
        state.updateJobError = action.payload;
 
      })
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.deleteJobStatus = 'loading';
        state.deleteJobError = null;
        state.deleteJobSuccess = false;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.deleteJobStatus = 'succeeded';
        state.deleteJobSuccess = true;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
       
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.deleteJobStatus = 'failed';
        state.deleteJobError = action.payload;

      });
  },
});

export const {
  setSearchQuery,
  setLocation,
  setStatusFilter,
  setPage,
  incrementPage,
  decrementPage,
  clearFilters,
  clearApplyState,
  clearAddJobState,
  clearUpdateJobState,
  clearDeleteJobState,
} = jobsSlice.actions;

export default jobsSlice.reducer;





