import React from "react";
// import ProfImg from "../../assets/girl1.png";
import Header from "../navbar/Header";
import Category from "../jobcategory/Category";
import Footer from "../footer/Footer";
import Featured from "../jobcategory/Featured";
import Articals from "../articals/Articals";

const Home = () => {
  return (
    <>
      <Header />

      {/* Search Bar moved up */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row bg-white border-4 border-blue-200 shadow-xl rounded-lg p-2 gap-2 sm:gap-0 sm:divide-x divide-gray-200 max-w-4xl mx-auto transition-all duration-300 hover:shadow-2xl">
            <input
              type="text"
              placeholder="Preferred Role"
              className="flex-1 px-4 py-3 outline-none text-sm"
            />
            <input
              type="text"
              placeholder="City or Location"
              className="flex-1 px-4 py-3 outline-none text-sm"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg sm:rounded-l-none text-sm font-medium hover:bg-blue-700 transition">
              Find Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-blue-50/30 to-primary/5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">

            {/* Left content */}
            {/* <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <p className="text-sm text-muted-foreground">
                Popular Searches: Designer, Developer, Web, IOS, PHP, Senior, Engineer
              </p>
            </div> */}

            {/* Right content - Hero image */}
            <div className="relative mt-8 lg:mt-0">
              {/* <img
                src={ProfImg}
                alt="Professional business executive"
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-xl lg:rounded-2xl shadow-2xl"
              /> */}

              {/* Floating candidates card */}
              {/* <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 p-3 sm:p-4 bg-background/95 backdrop-blur-sm shadow-lg rounded-lg">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex -space-x-1 sm:-space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full border-2 border-background"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 border-background"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full border-2 border-background"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-white font-bold">+</span>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

          </div>
        </div>
      </section>

      <Category />
      <Featured />
      <Articals />
      <Footer />
    </>
  );
};

export default Home;
