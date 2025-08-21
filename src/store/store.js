import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/userSlice.js";
import dashboardReducer from "../store/dashboardSlice.js";
import profileReducer from "../store/profileSlice.js";
import candidateReducer from "../store/candidateSlice.js"



const store = configureStore({
  reducer: {
    user: userReducer,
     dashboard: dashboardReducer,
     profile: profileReducer,
       candidate: candidateReducer,
  },
});

export default store;
