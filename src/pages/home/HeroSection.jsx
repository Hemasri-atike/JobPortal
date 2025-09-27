import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  setSearchQuery,
  setLocation,
} from "../../store/jobsSlice.js";
import IHirePeople from "../../../public/assets/IHire-boy.jpg";

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
  }, [
    localSearch,
    localLocation,
    statusFilter,
    page,
    jobsPerPage,
    fetchDebouncedJobs,
  ]);

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
    <section className="relative flex items-center justify-center overflow-hidden bg-[#89b4d4] pt-4">
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[22%_77%] gap-4 md:gap-6 max-w-5xl mx-auto items-center">
          {/* Image Section */}
          <div className="w-full animate-float transition-transform hover:scale-105">
            <img
              src={IHirePeople}
              alt="I Hire People"
              className="w-full h-auto max-h-[400px] object-cover rounded-2xl"
            />
          </div>

          {/* Search Form Section */}
          <div className="w-full flex flex-col justify-center space-y-3">
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-gray-900">
              Find Your{" "}
              <span className="text-white">Dream Job</span> Today
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex flex-col md:flex-row gap-3 p-2 bg-white/20 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg">
                {/* Job Search */}
                <div className="flex-1 relative border-r-1 border-gray-300">
                  <input
                    type="text"
                    placeholder="Job title, skills, or company"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 md:border-none outline-none pl-8 pr-3 py-2 text-sm text-white placeholder-white rounded-lg md:rounded-none"
                  />
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Location */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Location"
                    value={localLocation}
                    onChange={(e) => setLocalLocation(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 md:border-none outline-none pl-8 pr-3 py-2 text-sm text-white placeholder-white rounded-lg md:rounded-none"
                  />
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-[#4A628A] text-white px-4 py-2 text-sm rounded-full transition w-full md:w-auto"
                >
                  Get Jobs
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;