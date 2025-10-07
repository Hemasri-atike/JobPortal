import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Header from "./pages/navbar/Header";
import Category from "./pages/jobcategory/Category";
import Subcategories from "./pages/jobcategory/Subcategories";
import Login from "./login/Login";
import Register from "./login/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Admindashboard from "./pages/dashboard/Admindashboard";
import Profile from "./pages/cvdetails/profile/Profile";
import Myresume from "./pages/cvdetails/resumes/Myresume";
import Applied from "./pages/cvdetails/appliedjobs/Applied";
import JobAlert from "./pages/cvdetails/jobalerts/JobAlert";
import Shortlist from "./pages/cvdetails/shortlist/Shortlist";
import CvUpload from "./pages/cvdetails/cv/CvUpload";
import PreviewResume from "./pages/cvdetails/resumes/Previewresume";
import Unauthorized from "./login/Unauthorized";

import EmpDashboard from "./components/Employee/EmpDashboard";
import EmpPosting from "./components/Employee/EmpPosting";
import CmpProfile from "./components/Employee/CmpProfile";
import Applicants from "./components/Employee/Applicants";
import ApplicantsPage from "./components/Employee/ApplicantsPage";

import JobSearch from "./components/job/JobSearch";
import CadidateDetails from "./components/candidate/CadidateDetails";
import Messages from "./components/candidate/Messages";
import Company from "./components/companies/Company";
import Joblisting from "./components/common/Joblisting";
import Application from "./components/job/Application";

import ProtectedRoute from "./login/ProtectedRoute";
import ForgotPassword from "./login/ForgotPassword";
import Jobs from "./components/job/Jobs";
import JobDescrition from "./components/job/JobDescrition";
import SidebarJobSuggest from "./components/job/SidebarJobSuggest";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/nav" element={<Header />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobsearch" element={<JobSearch />} />
        <Route path="/companies" element={<Company />} />
        <Route path="/joblistings" element={<Joblisting />} />
        <Route path="/category" element={<Category />} />
        <Route path="/categories/:name" element={<Subcategories />} />
        <Route path="/jobs" element={<Jobs />} />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/jobdescription/:id" element={<JobDescrition />} />
        <Route path="/sidebar-jobsuggest" element={<SidebarJobSuggest />} />

        {/* Protected Routes */}
        {/* General Authenticated Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin", "employer", "job_seeker"]}
            />
          }
        >
          <Route path="/jobapplication" element={<Application />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admindashboard" element={<Admindashboard />} />
        </Route>

        {/* Employee Routes */}
        <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
          <Route path="/empdashboard" element={<EmpDashboard />} />
          <Route path="/empposting" element={<EmpPosting />} />
          <Route path="/empposting/:id" element={<EmpPosting />} />
          <Route path="/cmpprofile" element={<CmpProfile />} />
          {/* <Route path="/applicants" element={<Applicants />} /> */}

          <Route path="/applicants" element={<Applicants />} />
          <Route path="/jobs/:jobId/applicants" element={<ApplicantsPage />} />
        </Route>

        {/* Candidate Routes */}
        <Route element={<ProtectedRoute allowedRoles={["job_seeker"]} />}>
          {/* <Route path="/cadprofile" element={<Profile />} /> */}
          <Route path="/resume" element={<Myresume />} />
          <Route path="/applied" element={<Applied />} />
          <Route path="/job-alerts" element={<JobAlert />} />
          <Route path="/shortlisted-jobs" element={<Shortlist />} />
          <Route path="/cvmanager" element={<CvUpload />} />
          <Route path="/previewresume" element={<PreviewResume />} />
          <Route path="/caddetails" element={<CadidateDetails />} />
          <Route path="/cadmessages" element={<Messages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
