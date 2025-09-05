import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  employee: {
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    location: "",
    skills: [],
    education: [],
    experience: [],
    certifications: [],
    resume: null,
  },
  loading: false,
  error: null,
};

// Axios instance with auth header
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Fetch employee profile by ID
export const fetchEmployee = createAsyncThunk(
  "employee/fetchEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/employees/${id}`);
      return {
        fullName: res.data.employee.full_name || "",
        email: res.data.employee.email || "",
        phone: res.data.employee.phone || "",
        gender: res.data.employee.gender || "",
        dob: res.data.employee.dob || "",
        location: res.data.employee.location || "",
        resume: res.data.employee.resume ? { name: res.data.employee.resume } : null,
        skills: res.data.skills.map((s) => s.skill) || [],
        education: res.data.education || [],
        experience: res.data.experience || [],
        certifications: res.data.certifications.map((c) => c.cert_name) || [],
      };
    } catch (err) {
      console.error("Fetch employee error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Save employee profile
export const saveEmployee = createAsyncThunk(
  "employee/saveEmployee",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/employees`, data);
      return {
        employeeId: res.data.employeeId,
        ...data,
      };
    } catch (err) {
      console.error("Save employee error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Upload resume
export const uploadResume = createAsyncThunk(
  "employee/uploadResume",
  async ({ employeeId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await axiosInstance.post(`/employees/upload-resume/${employeeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { name: res.data.filePath };
    } catch (err) {
      console.error("Upload resume error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Add skill
export const addEmployeeSkill = createAsyncThunk(
  "employee/addSkill",
  async ({ employeeId, skill }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/employees/${employeeId}/skills`, { skill });
      return skill;
    } catch (err) {
      console.error("Add skill error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Remove skill
export const removeEmployeeSkill = createAsyncThunk(
  "employee/removeSkill",
  async ({ employeeId, skill }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/employee/${employeeId}/skills/${encodeURIComponent(skill)}`);
      return skill;
    } catch (err) {
      console.error("Remove skill error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Add education
export const addEmployeeEducation = createAsyncThunk(
  "employee/addEducation",
  async ({ employeeId, education }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/employees/${employeeId}/education`, education);
      return { id: res.data.educationId, ...education };
    } catch (err) {
      console.error("Add education error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Remove education
export const removeEmployeeEducation = createAsyncThunk(
  "employee/removeEducation",
  async ({ employeeId, educationId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/employee/${employeeId}/education/${educationId}`);
      return educationId;
    } catch (err) {
      console.error("Remove education error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Add experience
export const addEmployeeExperience = createAsyncThunk(
  "employee/addExperience",
  async ({ employeeId, experience }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/employees/${employeeId}/experience`, experience);
      return { id: res.data.experienceId, ...experience };
    } catch (err) {
      console.error("Add experience error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Remove experience
export const removeEmployeeExperience = createAsyncThunk(
  "employee/removeExperience",
  async ({ employeeId, experienceId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/employee/${employeeId}/experience/${experienceId}`);
      return experienceId;
    } catch (err) {
      console.error("Remove experience error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Add certification
export const addEmployeeCertification = createAsyncThunk(
  "employee/addCertification",
  async ({ employeeId, cert_name, organization, issue_date }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/employees/${employeeId}/certifications`, {
        cert_name,
        organization,
        issue_date,
      });
      return { id: res.data.certificationId, cert_name };
    } catch (err) {
      console.error("Add certification error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Remove certification
export const removeEmployeeCertification = createAsyncThunk(
  "employee/removeCertification",
  async ({ employeeId, cert_name }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/employee/${employeeId}/certifications/${encodeURIComponent(cert_name)}`);
      return cert_name;
    } catch (err) {
      console.error("Remove certification error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.employee[field] = value;
    },
    setResume: (state, action) => {
      state.employee.resume = action.payload;
    },
    resetProfile: (state) => {
      state.employee = initialState.employee;
      state.error = null;
    },
    setAllFields: (state, action) => {
      state.employee = { ...state.employee, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employee
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save Employee
      .addCase(saveEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(saveEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Resume
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.employee.resume = action.payload;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Skill
      .addCase(addEmployeeSkill.fulfilled, (state, action) => {
        state.employee.skills.push(action.payload);
      })
      .addCase(addEmployeeSkill.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove Skill
      .addCase(removeEmployeeSkill.fulfilled, (state, action) => {
        state.employee.skills = state.employee.skills.filter((skill) => skill !== action.payload);
      })
      .addCase(removeEmployeeSkill.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add Education
      .addCase(addEmployeeEducation.fulfilled, (state, action) => {
        state.employee.education.push(action.payload);
      })
      .addCase(addEmployeeEducation.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove Education
      .addCase(removeEmployeeEducation.fulfilled, (state, action) => {
        state.employee.education = state.employee.education.filter((edu) => edu.id !== action.payload);
      })
      .addCase(removeEmployeeEducation.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add Experience
      .addCase(addEmployeeExperience.fulfilled, (state, action) => {
        state.employee.experience.push(action.payload);
      })
      .addCase(addEmployeeExperience.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove Experience
      .addCase(removeEmployeeExperience.fulfilled, (state, action) => {
        state.employee.experience = state.employee.experience.filter((exp) => exp.id !== action.payload);
      })
      .addCase(removeEmployeeExperience.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add Certification
      .addCase(addEmployeeCertification.fulfilled, (state, action) => {
        state.employee.certifications.push(action.payload.cert_name);
      })
      .addCase(addEmployeeCertification.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove Certification
      .addCase(removeEmployeeCertification.fulfilled, (state, action) => {
        state.employee.certifications = state.employee.certifications.filter(
          (cert) => cert !== action.payload
        );
      })
      .addCase(removeEmployeeCertification.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { updateField, setResume, resetProfile, setAllFields } = employeeSlice.actions;

export default employeeSlice.reducer;