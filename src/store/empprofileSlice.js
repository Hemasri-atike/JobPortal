// src/redux/employeeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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

};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addSkill: (state, action) => {
      state.skills.push(action.payload);
    },
    addEducation: (state, action) => {
      state.education.push(action.payload);
    },
    addExperience: (state, action) => {
      state.experience.push(action.payload);
    },
    addCertification: (state, action) => {
      state.certifications.push(action.payload);
    },
    setResume: (state, action) => {
      state.resume = action.payload;
    },
    resetProfile: () => initialState,
  },
     // ✅ Add this reducer to set all fields at once from backend
     setAllFields: (state, action) => {
      return { ...state, ...action.payload };
    },
  },

);

export const {
  updateField,
  addSkill,
  addEducation,
  addExperience,
  addCertification,
  setResume,
  resetProfile,
  setAllFields, // ✅ export it
} = employeeSlice.actions;

export default employeeSlice.reducer;
