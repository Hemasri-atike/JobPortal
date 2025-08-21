import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice.js";
import dashboardReducer from "../store/dashboardSlice.js";
import profileReducer from "../store/profileSlice.js";
import candidateReducer from "../store/candidateSlice.js";
import jobsReducer from "../store/jobsSlice.js"



const store = configureStore({
  reducer: {
    user: userReducer,
     dashboard: dashboardReducer,
     profile: profileReducer,
       candidate: candidateReducer,
       jobs: jobsReducer,
  },
});

export default store;
