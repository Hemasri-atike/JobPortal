import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Axios instance with interceptors
const axiosAuth = (token) =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Use Vite env variable
    headers: { Authorization: `Bearer ${token}` },
    timeout: 10000,
  });


export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ statusFilter = 'open', searchQuery = '', page = 1, jobsPerPage = 6, subcategory }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const params = {
        status: statusFilter,
        query: searchQuery,
        page,
        perPage: jobsPerPage,
        ...(subcategory && { subcategory }),
      };
      const response = await axiosAuth(token).get('/jobs', { params });
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

      console.log(`fetchJobById: Fetching job for jobId=${jobId}`);
      const response = await axiosAuth(token).get(`/jobs/${jobId}`);

      console.log(`fetchJobById: Successfully fetched job for jobId=${jobId}`, response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Job not found';
      console.error(`fetchJobById Error:`, errorMessage);
      return rejectWithValue(errorMessage); // Return string
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
      console.log('fetchCategories: userInfo=', userInfo, 'token=', token ? 'present' : 'missing');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      const res = await axiosAuth(token).get('/jobs/categories');
      console.log('fetchCategories: Response=', res.data);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch categories';
      console.error('fetchCategories Error:', errorMessage, 'Status:', err.response?.status);
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
      console.log('fetchJobsByCategory: category=', category, 'userInfo=', userInfo, 'token=', token ? 'present' : 'missing');
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
      console.error('fetchJobsByCategory Error:', errorMessage);
      return rejectWithValue(errorMessage); // Return string
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
      console.log('fetchUserApplications: candidateId=', candidateId, 'userInfo=', userInfo, 'userType=', userType, 'token=', token ? 'present' : 'missing');
      if (!token || !userInfo || userType !== 'job_seeker' || userInfo.id !== candidateId) {
        throw new Error('Authentication required or unauthorized access');
      }
      const res = await axiosAuth(token).get('/applications', {
        params: { candidate_id: candidateId },
      });
      return res.data.map((app) => app.job_id);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch user applications';
      console.error('fetchUserApplications Error:', errorMessage);
      return rejectWithValue(errorMessage); // Return string
    }
  }
);

// Add job
export const addJob = createAsyncThunk(
  'jobs/addJob',
  async (jobData, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      console.log('addJob: jobData=', jobData, 'userInfo=', userInfo, 'token=', token ? 'present' : 'missing');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      const res = await axiosAuth(token).post('/jobs', { ...jobData, user_id: userInfo.id });
      return { jobId: res.data.jobId, job: { ...res.data, createdAt: res.data.created_at || new Date().toISOString() } };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to add job';
      console.error('addJob Error:', errorMessage);
      return rejectWithValue(errorMessage); // Return string
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
      console.log('updateJob: id=', id, 'jobData=', jobData, 'userInfo=', userInfo, 'token=', token ? 'present' : 'missing');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      const res = await axiosAuth(token).put(`/jobs/${id}`, { ...jobData, user_id: userInfo.id });
      return { id, ...res.data, createdAt: res.data.created_at || res.data.createdAt || new Date().toISOString() };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update job';
      console.error('updateJob Error:', errorMessage);
      return rejectWithValue(errorMessage); // Return string
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
      console.log('deleteJob: id=', id, 'userInfo=', userInfo, 'token=', token ? 'present' : 'missing');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      await axiosAuth(token).delete(`/jobs/${id}`);
      return id;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to delete job';
      console.error('deleteJob Error:', errorMessage);
      return rejectWithValue(errorMessage); // Return string
    }
  }
);
export const fetchApplicantsByJob = createAsyncThunk(
  'jobs/fetchApplicantsByJob',
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { user: { userInfo } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      console.log(`fetchApplicantsByJob: jobId=${jobId}, userInfo=`, userInfo, 'token=', token ? 'present' : 'missing');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      if (!jobId || isNaN(Number(jobId))) {
        throw new Error('Invalid job ID');
      }
      const response = await axiosAuth(token).get(`/jobs/${jobId}/applicants`);
      console.log(`fetchApplicantsByJob: Response for jobId=${jobId}`, response.data);
      return { jobId, applicants: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch applicants';
      console.error('fetchApplicantsByJob Error:', { jobId, error: errorMessage, status: err.response?.status, data: err.response?.data });
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
      console.log('bulkDeleteJobs: jobIds=', jobIds, 'userInfo=', userInfo, 'token=', token ? 'present' : 'missing');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      await axiosAuth(token).post('/jobs/bulk-delete', { jobIds });
      return jobIds;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to bulk delete jobs';
      console.error('bulkDeleteJobs Error:', errorMessage);
      return rejectWithValue(errorMessage); // Return string
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
      console.log('toggleJobStatus: id=', id, 'currentStatus=', currentStatus, 'userInfo=', userInfo, 'token=', token ? 'present' : 'missing');
      if (!token || !userInfo) {
        throw new Error('Authentication required');
      }
      const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
      await axiosAuth(token).patch(`/jobs/${id}`, { status: newStatus });
      return { id, status: newStatus };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to toggle job status';
      console.error('toggleJobStatus Error:', errorMessage);
      return rejectWithValue(errorMessage); // Return string
    }
  }
);




// Fetch all applicants for employer's jobs
export const fetchApplicants = createAsyncThunk(
  'jobs/fetchApplicants',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.userInfo?.token || localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('fetchApplicants: userInfo=', user.userInfo, 'userType=', user.userType, 'token=', token ? 'present' : 'missing');
      const response = await axiosAuth(token).get('/applications');

      console.log('fetchApplicants: Successfully fetched applicants', response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch applicants';
      console.error('fetchApplicants Error:', errorMessage);
      if (error.response?.status === 404) {
        console.log('fetchApplicants: No applicants found, returning empty array');
        return [];
      }
      return rejectWithValue(errorMessage); // Return string
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

      console.log('fetchAnalytics: userInfo=', user.userInfo, 'userType=', user.userType, 'token=', token ? 'present' : 'missing');
      const response = await axiosAuth(token).get('/analytics');

      console.log('fetchAnalytics: Successfully fetched analytics', response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch analytics';
      console.error('fetchAnalytics Error:', errorMessage);
      if (error.response?.status === 404) {
        console.log('fetchAnalytics: No analytics data found, returning default object');
        return { views: 0, applicantCount: 0 };
      }
      return rejectWithValue(errorMessage); // Return string
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

      console.log('fetchInterviews: userInfo=', user.userInfo, 'userType=', user.userType, 'token=', token ? 'present' : 'missing');
      const response = await axiosAuth(token).get('/interviews');

      console.log('fetchInterviews: Successfully fetched interviews', response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch interviews';
      console.error('fetchInterviews Error:', errorMessage);
      if (error.response?.status === 404) {
        console.log('fetchInterviews: No interviews found, returning empty array');
        return [];
      }
      return rejectWithValue(errorMessage); // Return string
    }
  }
);

// Apply to job
export const applyToJobThunk = createAsyncThunk(
  'jobs/applyToJob',
  async (applicationData, { rejectWithValue, getState }) => {
    try {
      const { user: { userInfo, userType } } = getState();
      const token = userInfo?.token || localStorage.getItem('token');
      console.log('applyToJobThunk: applicationData=', applicationData, 'userInfo=', userInfo, 'userType=', userType, 'token=', token ? 'present' : 'missing');
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
      console.error('applyToJobThunk Error:', errorMessage);
      return rejectWithValue(errorMessage); // Return string
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
        state.jobsPerPage = action.payload.limit || state.jobsPerPage;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload; // String
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
        state.jobsError = action.payload; // String
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
        state.categoriesError = action.payload; // String
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
        state.jobsError = action.payload; // String
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
        state.jobsError = action.payload; // String
      })
      // Apply to Job
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
        state.applyError = action.payload; // String
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
        state.jobs = [...state.jobs, { id: action.payload.jobId, ...action.payload.job, applicantCount: 0, views: 0 }];
        state.total += 1;
      })
      .addCase(addJob.rejected, (state, action) => {
        state.addJobStatus = 'failed';
        state.addJobError = action.payload; // String
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
        state.updateJobError = action.payload; // String
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
        state.deleteJobError = action.payload; // String
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
        state.bulkDeleteError = action.payload; // String
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
        state.toggleStatusError = action.payload; // String
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
        state.jobsError = action.payload; // String
      })
      // Fetch Applicants (all for employer)
      .addCase(fetchApplicants.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.applicants.all = action.payload || [];
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload; // String
      })
      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.analytics = action.payload || {};
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload; // String
      })
      // Fetch Interviews
      .addCase(fetchInterviews.pending, (state) => {
        state.jobsStatus = 'loading';
        state.jobsError = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.jobsStatus = 'succeeded';
        state.upcomingInterviews = action.payload || [];
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.jobsStatus = 'failed';
        state.jobsError = action.payload; // String
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


export const applyForJob = createAsyncThunk(
  'jobs/applyForJob',
  async (applicationData, { rejectWithValue, getState, dispatch }) => {
    try {
      const { user: { userInfo, userType } } = getState();
      let token = userInfo?.token || localStorage.getItem('token');
      console.log('applyForJob: jobId=', applicationData.jobId, 'userInfo=', userInfo, 'userType=', userType, 'token=', token ? 'present' : 'missing');

      if (!applicationData.jobId || applicationData.jobId === 'undefined' || isNaN(applicationData.jobId)) {
        throw new Error('Invalid job ID');
      }
      if (!token || !userInfo || userType !== 'job_seeker') {
        throw new Error('Authentication required or unauthorized access');
      }

      const formData = new FormData();
      Object.entries(applicationData).forEach(([key, value]) => {
        if (key === 'resume' && value) formData.append('resume', value);
        else if (key === 'coverLetter' && value) formData.append('coverLetter', value);
        else if (value) formData.append(key, value);
      });
      formData.append('status', 'applied');
      formData.append('candidate_id', userInfo.id);

      try {
        const response = await axiosAuth(token).post(`/jobs/${applicationData.jobId}/apply`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('applyForJob: Success, response=', response.data);
        return response.data;
      } catch (err) {
        if (err.response?.status === 401 && err.response.data.error === 'Invalid or expired token') {
          console.error('applyForJob: Token expired, redirecting to login');
          throw new Error('Your session has expired. Please log in again.');
        }
        throw err;
      }
    } catch (err) {
      let errorMessage = 'Failed to apply to job';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = err.response.data.details || 'Your session has expired. Please log in again.';
        } else if (err.response.status === 400) {
          errorMessage = err.response.data.details || 'Invalid application data. Please check your inputs.';
        } else if (err.response.status === 403) {
          errorMessage = err.response.data.details || 'You are not authorized to apply to this job. It may be inactive or you have already applied.';
        } else if (err.response.status === 404) {
          errorMessage = 'Job not found. It may have been removed.';
        } else {
          errorMessage = err.response.data.error || err.response.data.message || errorMessage;
        }
      } else {
        errorMessage = err.message || errorMessage;
      }
      console.error('applyForJob Error:', errorMessage, err.response?.data);
      return rejectWithValue(errorMessage);
    }
  }
);
