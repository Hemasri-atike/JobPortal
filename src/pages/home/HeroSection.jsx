import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  setSearchQuery,
  setLocation,
} from "../../store/jobsSlice.js";

const HeroSection = () => {
  const dispatch = useDispatch();
  const {
    searchQuery,
    location: reduxLocation,
    statusFilter,
    page,
    jobsPerPage,
  } = useSelector((state) => state.jobs);

  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [localLocation, setLocalLocation] = useState(reduxLocation || "");
  const debounceRef = useRef(null);

  // Debounced fetch
  const fetchDebouncedJobs = React.useCallback(() => {
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
  }, [dispatch, statusFilter, localSearch, localLocation, page, jobsPerPage]);

  // Fetch jobs when localSearch or localLocation changes
  useEffect(() => {
    if ((localSearch || "").trim() || (localLocation || "").trim()) {
      fetchDebouncedJobs();
    }
  }, [localSearch, localLocation, statusFilter, page, jobsPerPage, fetchDebouncedJobs]);

  // Handle form submit
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    dispatch(setLocation(localLocation));
    fetchDebouncedJobs();
  };

  // Sync local state with Redux
  useEffect(() => setLocalSearch(searchQuery || ""), [searchQuery]);
  useEffect(() => setLocalLocation(reduxLocation || ""), [reduxLocation]);

  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
            Find Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Dream Job
            </span>
            <span> Today</span>
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 p-2 md:p-2 bg-white/20 backdrop-blur-md border border-gray-200 rounded-lg shadow-sm">
              {/* Job Search */}
              <div className="flex-1 relative border-r-1 border-gray-300">
                <input
                  type="text"
                  placeholder="Job title, skills, or company"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 md:border-none outline-none 
                             pl-8 pr-3 py-1 text-sm md:pl-10 md:pr-4 md:py-2 md:text-sm
                             text-gray-900 placeholder-gray-500 
                             rounded-lg md:rounded-none"
                />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center">
                  <Search className="w-4 h-4 text-gray-500 md:w-4 md:h-4" />
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
                             pl-8 pr-3 py-1 text-sm md:pl-10 md:pr-4 md:py-2 md:text-sm
                             text-gray-900 placeholder-gray-500 
                             rounded-lg md:rounded-none"
                />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center">
                  <MapPin className="w-4 h-4 text-gray-500 md:w-4 md:h-4" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#4A628A] text-white 
                           px-4 py-1 text-sm md:px-5 md:py-1 md:text-sm
                           rounded-full transition 
                           w-full md:w-auto h-auto"
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