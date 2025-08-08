import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';                                                                                                                   
import Header from './pages/navbar/Header';
import Category from './pages/jobcategory/Category';


const App = () => {
  return (
   <>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nav"element={<Header/>}/>

      <Route path='/category' element={<Category/>}/>
    

      
    </Routes>
  </BrowserRouter>
   </>
  )
}

export default App
