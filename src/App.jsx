import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';                                                                                                                   
import Header from './pages/navbar/Header';
import Category from './pages/jobcategory/Category';
import Login from './login/Login';
import Register from './login/Register';

import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/cvdetails/profile/Profile';
import Myresume from './pages/cvdetails/resumes/Myresume';
import Applied from './pages/cvdetails/appliedjobs/Applied';
import JobAlert from './pages/cvdetails/jobalerts/JobAlert';
import Shortlist from './pages/cvdetails/shortlist/Shortlist';
import CvUpload from './pages/cvdetails/cv/CvUpload';
import EmpProfile from './components/Employee/EmpProfile';
import EmpDashboard from './components/Employee/EmpDashboard';
import JobSearch from './components/job/JobSearch';
import EmpPosting from './components/Employee/EmpPosting';
import CadidateDetails from './components/candidate/CadidateDetails';
import Company from './components/companies/Company';

import Applicants from './components/Employee/Applicants';

import Joblisting from './components/common/Joblisting';
import Messages from './components/candidate/Messages';
import Application from './components/job/Application';
import Admindashboard from './pages/dashboard/Admindashboard';
import JobApply from './components/job/JobApply';
import Subcategories from './pages/jobcategory/Subcategories';
import PreviewResume from './pages/cvdetails/resumes/Previewresume';
import CmpProfile from './components/Employee/CmpProfile';

const App = () => {
  return (
   <>
  <BrowserRouter>
    <Routes>
    {/* <Route path="/" element={<UserType />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
                <Route path="/jobapplication" element={<Application />} />
                <Route path="/admindashboard" element={<Admindashboard />} />






      <Route path="/" element={<Home />} />
      <Route path="/nav"element={<Header/>}/>
      {/* Employee */}
          <Route path='/empprofile' element={<EmpProfile/>}/>
          <Route path='/empdashboard' element={<EmpDashboard/>}/>
              <Route path='/empposting' element={<EmpPosting/>}/>
                  <Route path='/applicants' element={<Applicants/>}/>
       




              {/* candidate */}
              <Route path='/caddetails' element={<CadidateDetails/>}/>
                     <Route path='/cadmessages' element={<Messages/>}/>
                      <Route path='/jobapply' element={<JobApply/>}/> 
                       <Route path='/previewresume' element={<PreviewResume/>}/>
                             
                      


{/* Job Search */}
  <Route path='/jobsearch' element={<JobSearch/>}/>
    <Route path='/companies' element={<Company/>}/>

     <Route path="/cmpprofile" element={<CmpProfile/>} />


      <Route path='/category' element={<Category/>}/> 
       <Route path="/categories/:id" element={<Subcategories />} />
      

            <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/cadprofile" element={<Profile/>}/>
                 <Route path="/resume" element={<Myresume/>}/>
                  <Route path="/applied" element={<Applied/>}/>
                     
                          <Route path="/job-alerts" element={<JobAlert/>}/>
                           <Route path="/shortlisted-jobs" element={<Shortlist/>}/>
                            <Route path="/cvmanager" element={<CvUpload/>}/>
                               <Route path="/joblistings" element={<Joblisting/>}/>

                    
    </Routes>
  </BrowserRouter>
   </>
  )
}

export default App
