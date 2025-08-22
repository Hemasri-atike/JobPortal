import React, { useState } from "react";
import Header from "../navbar/Header";
import Category from "../jobcategory/Category";
import Footer from "../footer/Footer";
import Featured from "../jobcategory/Featured";
import Articals from "../articals/Articals";
import { Search } from "lucide-react"; 
import HeroSection from "./HeroSection";


const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <Category />
      <Featured />
      {/* <Articals /> */}
      <Footer />
    </>
  );
};

export default Home;