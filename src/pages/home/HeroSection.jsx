import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, setSearchQuery, setLocation } from "../../store/jobsSlice.js";

const HeroSection = () => {
  const dispatch = useDispatch();
  const { searchQuery, location: reduxLocation, statusFilter, page, jobsPerPage } =
    useSelector((state) => state.jobs);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localLocation, setLocalLocation] = useState(reduxLocation);
  const debounceRef = useRef(null);

  const fetchDebouncedJobs = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(
        fetchJobs({
          statusFilter,
          searchQuery: localSearch,
          location: localLocation,
          page,
          jobsPerPage,
        })
      );
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    dispatch(setLocation(localLocation));
    fetchDebouncedJobs();
  };

  // Sync local state with Redux
  useEffect(() => setLocalSearch(searchQuery), [searchQuery]);
  useEffect(() => setLocalLocation(reduxLocation), [reduxLocation]);

  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-10 right-10 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
            Find Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Dream Job
            </span>
            <br />
            Today
          </h1>

          {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
  <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-2 md:p-3 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm">
    {/* Job Search */}
    <div className="flex-1 relative">
      <input
        type="text"
        placeholder="Job title, skills, or company"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="w-full bg-transparent border border-gray-300 md:border-none outline-none 
                   pl-8 pr-3 py-2 text-sm md:pl-10 md:pr-4 md:py-4 md:text-base
                   text-gray-900 placeholder-gray-500 
                   rounded-lg md:rounded-none"
      />
      {/* Mobile Search Icon */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 md:hidden flex items-center">
        <Search className="w-4 h-4 text-gray-500" />
      </div>
    </div>

    {/* Location */}
    <div className="flex-1 relative">
      <input
        type="text"
        placeholder="Location"
        value={localLocation}
        onChange={(e) => setLocalLocation(e.target.value)}
        className="w-full bg-transparent border border-gray-300 md:border-none outline-none 
                   px-3 py-2 text-sm md:px-4 md:py-4 md:text-base
                   text-gray-900 placeholder-gray-500 
                   rounded-lg md:rounded-none"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="bg-blue-600 text-white 
                 px-4 py-2 text-sm md:px-8 md:py-4 md:text-base
                 rounded-lg hover:bg-blue-700 transition 
                 w-full md:w-auto"
    >
      Get Jobs
    </button>
  </div>
</form>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
