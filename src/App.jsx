import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/home/Home';
import Header from './pages/navbar/Header';
import Category from './pages/jobcategory/Category';
import Subcategories from './pages/jobcategory/Subcategories';
import Login from './login/Login';
import Register from './login/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Admindashboard from './pages/dashboard/Admindashboard';
import Profile from './pages/cvdetails/profile/Profile';
import Myresume from './pages/cvdetails/resumes/Myresume';
import Applied from './pages/cvdetails/appliedjobs/Applied';
import JobAlert from './pages/cvdetails/jobalerts/JobAlert';
import Shortlist from './pages/cvdetails/shortlist/Shortlist';
import CvUpload from './pages/cvdetails/cv/CvUpload';
import PreviewResume from './pages/cvdetails/resumes/Previewresume';

// Employee Components
import EmpProfile from './components/Employee/EmpProfile';
import EmpDashboard from './components/Employee/EmpDashboard';
import EmpPosting from './components/Employee/EmpPosting';
import CmpProfile from './components/Employee/CmpProfile';
import ApplicantsPage from './components/Employee/ApplicantsPage';

// Job / Candidate Components
import JobSearch from './components/job/JobSearch';
import CadidateDetails from './components/candidate/CadidateDetails';
import Messages from './components/candidate/Messages';
import Company from './components/companies/Company';
import Joblisting from './components/common/Joblisting';
import Application from './components/job/Application';
import Applicants from './components/Employee/Applicants';
import JobApplicants
 from './components/common/JobApplicants';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/nav" element={<Header />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobapplication" element={<Application />} />
               {/* <Route path="/jobapplicant" element={<JobApplicants />} /> */}

        {/* Admin */}
        <Route path="/admindashboard" element={<Admindashboard />} />

        {/* Employee Routes */}
        {/* <Route path="/empprofile" element={<EmpProfile />} /> */}
        <Route path="/empdashboard" element={<EmpDashboard />} />
        <Route path="/empposting" element={<EmpPosting />} />
        <Route path="/empposting/:id" element={<EmpPosting />} />
        <Route path="/cmpprofile" element={<CmpProfile />} />

   <Route path="applicants" element={<Applicants />} />
        {/* Applicants */}
    <Route path="/jobs/:jobId/applicants" element={<Applicants />} />


        {/* Candidate Routes */}
        <Route path="/caddetails" element={<CadidateDetails />} />
        <Route path="/cadmessages" element={<Messages />} />
        <Route path="/previewresume" element={<PreviewResume />} />
        <Route path="/resume" element={<Myresume />} />
        <Route path="/applied" element={<Applied />} />
        <Route path="/job-alerts" element={<JobAlert />} />
        <Route path="/shortlisted-jobs" element={<Shortlist />} />
        <Route path="/cvmanager" element={<CvUpload />} />

        {/* Job / Company */}
        <Route path="/jobsearch" element={<JobSearch />} />
        <Route path="/companies" element={<Company />} />
        <Route path="/joblistings" element={<Joblisting />} />

        {/* Job Categories */}
        <Route path="/category" element={<Category />} />
        <Route path="/categories/:id" element={<Subcategories />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cadprofile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
