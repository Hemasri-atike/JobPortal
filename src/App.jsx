import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';                                                                                                                   
import Header from './pages/navbar/Header';
import Category from './pages/jobcategory/Category';
import Login from './login/Login';
import Register from './login/Register';
import Cvmanager from './pages/cvdetails/Cvmanager';
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




const App = () => {
  return (
   <>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nav"element={<Header/>}/>
      {/* Employee */}
          <Route path='/empprofile' element={<EmpProfile/>}/>
          <Route path='/empdashboard' element={<EmpDashboard/>}/>
              <Route path='/empposting' element={<EmpPosting/>}/>

              {/* candidate */}
              <Route path='/caddetails' element={<CadidateDetails/>}/>


{/* Job Search */}
  <Route path='/jobsearch' element={<JobSearch/>}/>
    <Route path='/companies' element={<Company/>}/>
  




      <Route path='/category' element={<Category/>}/>
      <Route path="/login" element={<Login/>}/>
         <Route path="/register" element={<Register/>}/>
          <Route path="/upload-cv" element={<Cvmanager/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/cadprofile" element={<Profile/>}/>
                 <Route path="/resume" element={<Myresume/>}/>
                  <Route path="/applied" element={<Applied/>}/>
                     
                          <Route path="/job-alerts" element={<JobAlert/>}/>
                           <Route path="/shortlisted-jobs" element={<Shortlist/>}/>
                            <Route path="/cvmanager" element={<CvUpload/>}/>
                         

                             





      

    

      
    </Routes>
  </BrowserRouter>
   </>
  )
}

export default App
