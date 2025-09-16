import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Axios instance with interceptors
const axiosAuth = (token) =>
  axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` },
    timeout: 10000,
  });

// Fetch jobs
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ statusFilter = 'open', searchQuery = '', page = 1, jobsPerPage = 6, subcategory }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
     
      const params = {
        status: statusFilter,
        query: searchQuery,
        page,
        perPage: jobsPerPage,
        ...(subcategory && { subcategory }),
      };
      const response = await axios.get('http://localhost:5000/api/jobs', { params });
      return {
        jobs: response.data.jobs || [],
        total: response.data.total || 0,
        page: response.data.page || page,
        perPage: response.data.perPage || jobsPerPage,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch jobs';
      if (error.response?.status === 404) {
        return { jobs: [], total: 0, page, perPage: jobsPerPage };
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch job by ID
export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axiosAuth(token).get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Job not found';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'jobs/fetchCategories',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      const res = await axiosAuth(token).get('/jobs/categories');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch categories';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch jobs by category
export const fetchJobsByCategory = createAsyncThunk(
  'jobs/fetchJobsByCategory',
  async (category, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      const res = await axiosAuth(token).get('/jobs/by-category', {
        params: { category },
      });
      const normalizedJobs = (res.data.jobs || []).map((job) => ({
        ...job,
        createdAt: job.created_at || job.createdAt || new Date().toISOString(),
        applicantCount: job.applicantCount ?? 0,
        views: job.views ?? 0,
      }));
      return { jobs: normalizedJobs, total: Number(res.data.total) || 0 };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch jobs by category';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch user applications
export const fetchUserApplications = createAsyncThunk(
  'jobs/fetchUserApplications',
  async (candidateId, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo, userType } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo || userType !== 'job_seeker' || userInfo.id !== candidateId) {
        throw new Error('Authentication required or unauthorized access');
      }
      const res = await axiosAuth(token).get('/applications', {
        params: { candidate_id: candidateId },
      });
      return res.data.map((app) => app.job_id);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch user applications';
      return rejectWithValue(errorMessage);
    }
  }
);

// Add job (converted to async thunk)
export const addJob = createAsyncThunk(
  'jobs/addJob',
  async (jobData, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      const response = await axiosAuth(token).post('/jobs', { ...jobData, user_id: userInfo.id });
      return { ...response.data, createdAt: response.data.created_at || response.data.createdAt || new Date().toISOString(), applicantCount: 0, views: 0 };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to add job';
      return rejectWithValue(errorMessage);
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      const res = await axiosAuth(token).put(`/jobs/${id}`, { ...jobData, user_id: userInfo.id });
      return { id, ...res.data, createdAt: res.data.created_at || res.data.createdAt || new Date().toISOString() };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update job';
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      await axiosAuth(token).delete(`/jobs/${id}`);
      return id;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to delete job';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch applicants by job
export const fetchApplicantsByJob = createAsyncThunk(
  'jobs/fetchApplicantsByJob',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      if (!jobId || isNaN(Number(jobId))) {
        throw new Error('Invalid job ID');
      }
      const response = await axiosAuth(token).get(`/jobs/${jobId}/applicants`);
      return { jobId, applicants: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch applicants';
      return rejectWithValue(errorMessage);
    }
  }
);

// Bulk delete jobs
export const bulkDeleteJobs = createAsyncThunk(
  'jobs/bulkDeleteJobs',
  async (jobIds, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      await axiosAuth(token).post('/jobs/bulk-delete', { jobIds });
      return jobIds;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to bulk delete jobs';
      return rejectWithValue(errorMessage);
    }
  }
);

// Toggle job status
export const toggleJobStatus = createAsyncThunk(
  'jobs/toggleJobStatus',
  async ({ id, currentStatus }, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
      await axiosAuth(token).patch(`/jobs/${id}`, { status: newStatus });
      return { id, status: newStatus };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to toggle job status';
      return rejectWithValue(errorMessage);
    }
  }
);




export const fetchApplicants = createAsyncThunk(
  "jobs/fetchApplicants",
  async (_, { rejectWithValue }) => {
    try {
      // 🔹 No token check (public access for jobseekers + employers)
      const response = await axios.get("http://localhost:5000/api/applicants");

      return response.data || [];
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch applicants";

      // If no applicants found, return empty array
      if (error.response?.status === 404) {
        return [];
      }

      return rejectWithValue(errorMessage);
    }
  }
);


// Fetch analytics
export const fetchAnalytics = createAsyncThunk(
  'jobs/fetchAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axiosAuth(token).get('/analytics');
      return response.data || { views: 0, applicantCount: 0 };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch analytics';
      if (error.response?.status === 404) {
        return { views: 0, applicantCount: 0 };
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch interviews
export const fetchInterviews = createAsyncThunk(
  'jobs/fetchInterviews',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axiosAuth(token).get('/interviews');
      return response.data || [];
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch interviews';
      if (error.response?.status === 404) {
        return [];
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Apply for job
export const applyForJob = createAsyncThunk(
  'jobs/applyForJob',
  async (applicationData, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      if (!applicationData.jobId || isNaN(Number(applicationData.jobId))) {
        throw new Error('Invalid job ID');
      }
      const formData = new FormData();
      Object.entries(applicationData).forEach(([key, value]) => {
        if (key === 'resume' && value) formData.append('resume', value);
        else if (key === 'coverLetter' && value) formData.append('coverLetter', value);
        else if (value) formData.append(key, value);
      });
      formData.append('status', 'applied');
      formData.append('candidate_id', userInfo.id);
      const response = await axiosAuth(token).post(`/jobs/${applicationData.jobId}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      let errorMessage = 'Failed to apply to job';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = err.response.data.details || 'Your session has expired. Please log in again.';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.details || 'Invalid application data. Please check your inputs.';
        } else if (err.response.status === 403) {
          errorMessage = err.response.data.details || 'Access denied. Please check your permissions.';
        } else if (err.response.status === 404) {
          errorMessage = 'Job not found. It may have been removed.';
        } else {
          errorMessage = err.response.data.error || err.response.data.message || `Unexpected error (status: ${err.response.status})`;
        }
      } else {
        errorMessage = err.message || 'Network error: Unable to reach the server';
      }
      return rejectWithValue(errorMessage);
    }
  }
);


// Add this thunk back to jobsSlice.js, below the other thunks
export const applyToJobThunk = createAsyncThunk(
  'jobs/applyToJob',
  async (applicationData, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo, userType } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || !userInfo || userType !== 'job_seeker') {
        throw new Error('Authentication required or unauthorized access');
      }
      const formData = new FormData();
      Object.entries(applicationData).forEach(([key, value]) => {
        if (key === 'resume' && value) formData.append('resume', value);
        else if (value) formData.append(key, value);
      });
      formData.append('status', 'applied');
      formData.append('user_id', userInfo.id);
      const response = await axiosAuth(token).post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to apply to job';
      return rejectWithValue(errorMessage);
    }
  }
);



export const updateApplicantStatus = createAsyncThunk(
  'jobs/updateApplicantStatus',
  async ({ applicationId, status, interviewDate }, { getState, rejectWithValue }) => {
    try {
      const { user: { userInfo, userType } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      if (!token || userType !== 'employer') {
        throw new Error('Authentication required or unauthorized access');
      }
      const response = await axiosAuth(token).put(`/applications/${applicationId}/status`, { status, interviewDate });
      return { applicationId, status: response.data.status, interviewDate: response.data.interviewDate };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to update applicant status';
      return rejectWithValue(errorMessage);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    total: 0,
    page: 1,
    jobsPerPage: 10,
    searchQuery: '',
    location: '',
    statusFilter: 'All',
    categoryFilter: '',
    sortBy: 'createdAt-desc',
    jobsStatus: 'idle',
    jobsError: null,
    categories: [],
    categoriesStatus: 'idle',
    categoriesError: null,
    jobsByCategory: [],
    applications: [],
    applicationsData: [],
    applicants: {},
    analytics: {},
    upcomingInterviews: [],
    applying: false,
    applyError: null,
    applySuccess: null,
    addJobStatus: 'idle',
    addJobError: null,
    addJobSuccess: false,
    updateJobStatus: 'idle',
    updateJobError: null,
    updateJobSuccess: false,
    deleteJobStatus: 'idle',
    deleteJobError: null,
    deleteJobSuccess: false,
    bulkDeleteStatus: 'idle',
    bulkDeleteError: null,
    bulkDeleteSuccess: false,
    toggleStatus: 'idle',
    toggleStatusError: null,
    toggleStatusSuccess: false,
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
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
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
      state.statusFilter = 'All';
      state.categoryFilter = '';
      state.sortBy = 'createdAt-desc';
      state.page = 1;
    },
    clearApplyState: (state) => {
      state.applying = false;
      state.applyError = null;
      state.applySuccess = null;
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
    clearBulkDeleteState: (state) => {
      state.bulkDeleteStatus = 'idle';
      state.bulkDeleteError = null;
      state.bulkDeleteSuccess = false;
    },
    clearToggleStatusState: (state) => {
      state.toggleStatus = 'idle';
      state.toggleStatusError = null;
      state.toggleStatusSuccess = false;
    },
    clearApplicantsState: (state) => {
      state.applicants = {};
      state.jobsStatus = 'idle';
      state.jobsError = null;
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
        state.jobs = action.payload.jobs || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.jobsPerPage = action.payload.perPage || state.jobsPerPage;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
        state.jobs = [];
        state.total = 0;
      })
      // Fetch Job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        const existingJobIndex = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (existingJobIndex >= 0) {
          state.jobs[existingJobIndex] = action.payload;
        } else {
          state.jobs.push(action.payload);
        }
      })
      .addCase(fetchJobById.rejected, (state, action) => {
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
        state.categoriesError = action.payload;
        state.categories = [];
      })
      // Fetch Jobs by Category
      .addCase(fetchJobsByCategory.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchJobsByCategory.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.jobsByCategory = action.payload.jobs || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchJobsByCategory.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
        state.jobsByCategory = [];
      })
      // Fetch User Applications
      .addCase(fetchUserApplications.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.applications = action.payload || [];
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
        state.jobs = [...state.jobs, action.payload];
        state.total += 1;
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
          state.jobs[index] = { ...state.jobs[index], ...action.payload, applicantCount: state.jobs[index].applicantCount, views: state.jobs[index].views };
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
        state.total -= 1;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.deleteJobStatus = 'failed';
        state.deleteJobError = action.payload;
      })
      // Bulk Delete Jobs
      .addCase(bulkDeleteJobs.pending, (state) => {
        state.bulkDeleteStatus = 'loading';
        state.bulkDeleteError = null;
        state.bulkDeleteSuccess = false;
      })
      .addCase(bulkDeleteJobs.fulfilled, (state, action) => {
        state.bulkDeleteStatus = 'succeeded';
        state.bulkDeleteSuccess = true;
        state.jobs = state.jobs.filter((job) => !action.payload.includes(job.id));
        state.total -= action.payload.length;
      })
      .addCase(bulkDeleteJobs.rejected, (state, action) => {
        state.bulkDeleteStatus = 'failed';
        state.bulkDeleteError = action.payload;
      })
      // Toggle Job Status
      .addCase(toggleJobStatus.pending, (state) => {
        state.toggleStatus = 'loading';
        state.toggleStatusError = null;
        state.toggleStatusSuccess = false;
      })
      .addCase(toggleJobStatus.fulfilled, (state, action) => {
        state.toggleStatus = 'succeeded';
        state.toggleStatusSuccess = true;
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index].status = action.payload.status;
        }
      })
      .addCase(toggleJobStatus.rejected, (state, action) => {
        state.toggleStatus = 'failed';
        state.toggleStatusError = action.payload;
      })
      // Fetch Applicants by Job
      .addCase(fetchApplicantsByJob.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchApplicantsByJob.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.applicants[action.payload.jobId] = action.payload.applicants;
      })
      .addCase(fetchApplicantsByJob.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
      })
      // Fetch Applicants (all for employer)
      .addCase(fetchApplicants.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.applicants.all = action.payload;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
      })
      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
      })
      // Fetch Interviews
      .addCase(fetchInterviews.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.upcomingInterviews = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload;
      })
      // Apply for Job
      .addCase(applyForJob.pending, (state) => {
        state.applying = true;
        state.applyError = null;
        state.applySuccess = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.applying = false;
        state.applySuccess = action.payload;
        state.applications = [...new Set([...state.applications, action.payload.jobId])];
        state.applicationsData = [...state.applicationsData, action.payload];
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.applying = false;
        state.applyError = action.payload;
      })
        .addCase(applyToJobThunk.pending, (state) => {
    state.applying = true;
    state.applyError = null;
    state.applySuccess = null;
  })
  .addCase(applyToJobThunk.fulfilled, (state, action) => {
    state.applying = false;
    state.applySuccess = action.payload;
    state.applications = [...new Set([...state.applications, action.payload.jobId])];
    state.applicationsData = [...state.applicationsData, action.payload];
  })
  .addCase(applyToJobThunk.rejected, (state, action) => {
    state.applying = false;
    state.applyError = action.payload;
  })
  
  
  .addCase(updateApplicantStatus.pending, (state) => {
  state.updateStatusStatus = 'loading';
  state.updateStatusError = null;
  state.updateStatusSuccess = false;
})
.addCase(updateApplicantStatus.fulfilled, (state, action) => {
  state.updateStatusStatus = 'succeeded';
  state.updateStatusSuccess = true;
  // Update status in applicants.all
  if (state.applicants.all) {
    const index = state.applicants.all.findIndex((app) => app.id === action.payload.applicationId);
    if (index !== -1) {
      state.applicants.all[index].status = action.payload.status;
      state.applicants.all[index].interviewDate = action.payload.interviewDate;
    }
  }
  // Update status in applicants[jobId]
  Object.keys(state.applicants).forEach((jobId) => {
    if (jobId !== 'all') {
      const index = state.applicants[jobId].findIndex((app) => app.id === action.payload.applicationId);
      if (index !== -1) {
        state.applicants[jobId][index].status = action.payload.status;
        state.applicants[jobId][index].interviewDate = action.payload.interviewDate;
      }
    }
  });
})
.addCase(updateApplicantStatus.rejected, (state, action) => {
  state.updateStatusStatus = 'failed';
  state.updateStatusError = action.payload;
});
  },
});

export const {
  setSearchQuery,
  setLocation,
  setStatusFilter,
  setCategoryFilter,
  setSortBy,
  setPage,
  incrementPage,
  decrementPage,
  clearFilters,
  clearApplyState,
  clearAddJobState,
  clearUpdateJobState,
  clearDeleteJobState,
  clearBulkDeleteState,
  clearToggleStatusState,
  clearApplicantsState,
} = jobsSlice.actions;

export default jobsSlice.reducer;