import React from "react";
import ProfImg from "../../assets/girl1.png";
import Header from "../navbar/Header";
import Category from "../jobcategory/Category";
import Footer from "../footer/Footer";
import Featured from "../jobcategory/Featured";
import Articals from "../articals/Articals";
import Button from "../../components/ui/Button";

const Home = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-blue-50/30 to-primary/5 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                  There Are{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    93,178
                  </span>{" "}
                  Postings
                  <br />
                  Here
                  <br />
                  <span className="text-primary">For you!</span>
                </h3>

                <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-md mx-auto lg:mx-0">
                  Find Jobs, Employment & Career Opportunities
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition">
                  Find Jobs
                </button>

                <Button size="lg" variant="outline">
                  Upload Resume
                </Button>
              </div>

              {/* Notification card */}
              <div className="absolute top-4 right-4 lg:top-8 lg:right-8 p-3 lg:p-4 w-64 lg:w-72 bg-background/95 backdrop-blur-sm shadow-lg hidden md:block rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12H8m0 0l4-4m-4 4l4 4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 order-4">
                    <h4 className="font-semibold text-foreground text-sm lg:text-base">
                      Work Inquiry From
                    </h4>
                    <p className="text-muted-foreground font-medium text-sm lg:text-base">
                      Ali Tufan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right content - Hero image */}
            <div className="relative mt-8 lg:mt-0">
              <img
                src={ProfImg}
                alt="Professional business executive"
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-xl lg:rounded-2xl shadow-2xl"
              />

              {/* Floating candidates card */}
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 p-3 sm:p-4 bg-background/95 backdrop-blur-sm shadow-lg rounded-lg">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex -space-x-1 sm:-space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full border-2 border-background"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 border-background"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full border-2 border-background"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-white font-bold">+</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      10k+ Candidates
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating startup card */}
              <div className="absolute top-4 -right-2 sm:top-8 sm:-right-4 p-2 sm:p-3 bg-background/95 backdrop-blur-sm shadow-lg rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-pink-500 rounded"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-xs sm:text-sm">
                      Creative Agency
                    </p>
                    <p className="text-muted-foreground text-xs">Startup</p>
                  </div>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-500 text-xs">♥</span>
                  </div>
                </div>
              </div>
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
