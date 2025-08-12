import React, { useState } from "react";
import Header from "../navbar/Header";
import Category from "../jobcategory/Category";
import Footer from "../footer/Footer";
import Featured from "../jobcategory/Featured";
import Articals from "../articals/Articals";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", { searchQuery, location });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image - Removed */}
      <div className="absolute inset-0 z-0">
        {/* Image is commented out, no background color */}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Find Your <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Dream Job</span>
            <br />
            Today
          </h1>

          {/* Subheading */}
          {/* <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
            Connect with top companies and discover opportunities that match your skills and aspirations
          </p> */}

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Job title, skills, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none px-4 py-4 text-gray-900 placeholder-gray-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 md:hidden">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="w-full md:w-64 relative">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-none outline-none px-4 py-4 text-gray-900 placeholder-gray-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 md:hidden">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 whitespace-nowrap rounded-lg hover:bg-blue-700 transition"
              >
                <svg
                  className="w-5 h-3 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search Jobs
              </button>
            </div>
          </form>

          {/* Stats - Commented Out */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div
              className="text-center animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                50K+
              </div>
              <div className="text-gray-700">Active Jobs</div>
            </div>
            <div
              className="text-center animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                10K+
              </div>
              <div className="text-gray-700">Companies</div>
            </div>
            <div
              className="text-center animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                1M+
              </div>
              <div className="text-gray-700">Job Seekers</div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div> */}
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <Category />
      <Featured />
      <Articals />
      <Footer />
    </>
  );
};

export default Home;