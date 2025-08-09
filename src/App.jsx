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


const App = () => {
  return (
   <>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nav"element={<Header/>}/>

      <Route path='/category' element={<Category/>}/>
      <Route path="/login" element={<Login/>}/>
         <Route path="/signup" element={<Register/>}/>
          <Route path="/upload-cv" element={<Cvmanager/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/profile" element={<Profile/>}/>

      

    

      
    </Routes>
  </BrowserRouter>
   </>
  )
}

export default App
