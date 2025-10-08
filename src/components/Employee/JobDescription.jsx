import React, { useEffect, useState } from "react"; // useState comes from React
import { useDispatch, useSelector } from "react-redux"; // react-redux only has these
import { useParams } from "react-router-dom";

import { fetchJobById } from "../../store/jobsSlice";
import SidebarJobSuggest from "../Employee/SidebarJobSuggest";
import Header from "../../pages/navbar/Header";
import Application from "../job/Application";
import Footer from "../../pages/footer/Footer";
import { FaBriefcase, FaMapMarkerAlt, FaTasks, FaCode, FaGraduationCap, FaDollarSign, FaClock, FaUsers, FaEnvelope } from "react-icons/fa";
import { Star } from "lucide-react";


const JobDescription = () => {
  const { jobId } = useParams(); // <-- get jobId from route
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const dispatch = useDispatch();
  const { jobs, jobsStatus, jobsError } = useSelector((state) => state.jobs);
  
 
  const jobData = jobs.find((job) => job.id === Number(jobId));


  useEffect(() => {
    if (!jobData && jobId) {
      dispatch(fetchJobById(jobId));
    }
  }, [dispatch, jobId, jobData]);
  
  






  if (jobsStatus === "loading") return <p>Loading job details...</p>;
  if (jobsStatus === "failed") return <p>Error: {jobsError}</p>;
  if (!jobData) return <p>Job not found</p>;

  // Handle potential field name variations (e.g., company_name vs companyName)
  const companyName = jobData.company_name || jobData.companyName || "Company";
  const rating = jobData.rating || 4.2; // Default if not available

  return (
    <section className="min-h-screen font-sans bg-[#89b4d4]/10">
      <Header />
      <div className="relative top-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        {/* Header */}
        <header className="max-w-7xl mx-auto mb-7">
          <div className="job-card bg-white rounded-lg border border-[#89b4d4]/30 shadow-sm hover:shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#3b4f73] mb-2">{jobData.title}</h1>
              <div className="text-[#3b4f73]/80 flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                <span className="font-normal text-sm text-[#3b4f73] leading-relaxed">{companyName}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < Math.round(rating)
                          ? "text-[#89b4d4] fill-[#89b4d4]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm pl-1 text-[#3b4f73]">{rating}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <span className="flex items-center font-normal text-sm text-[#3b4f73] leading-relaxed">
                  <FaBriefcase color="#89b4d4" className="mr-1" /> {jobData.experience || "N/A"}
                </span>
                <span className="flex items-center font-normal text-sm text-[#3b4f73] leading-relaxed">
                  <FaMapMarkerAlt color="#89b4d4" className="mr-1" /> {jobData.city}, {jobData.state || "N/A"}
                </span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="bg-[#89b4d4] hover:bg-[#3b4f73] text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Overview */}
            <section className="bg-white rounded-lg border border-[#89b4d4]/30 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#3b4f73] mb-4 flex items-center">
                <FaBriefcase className="mr-2 text-[#89b4d4]" />
                Job Overview
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaDollarSign className="mt-1 mr-3 text-[#89b4d4] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#3b4f73]">Salary</p>
                    <p className="text-[#3b4f73]/80">{jobData.salary ? `₹${jobData.salary.toLocaleString()}` : "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaClock className="mt-1 mr-3 text-[#89b4d4] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#3b4f73]">Job Type</p>
                    <p className="text-[#3b4f73]/80">{jobData.type || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaUsers className="mt-1 mr-3 text-[#89b4d4] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#3b4f73]">Vacancies</p>
                    <p className="text-[#3b4f73]/80">{jobData.vacancies || 1}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="mt-1 mr-3 text-[#89b4d4] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#3b4f73]">Contact Person</p>
                    <p className="text-[#3b4f73]/80">{jobData.contactPerson || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaClock className="mt-1 mr-3 text-[#89b4d4] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#3b4f73]">Application Deadline</p>
                    <p className="text-[#3b4f73]/80">{jobData.deadline || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaClock className="mt-1 mr-3 text-[#89b4d4] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#3b4f73]">Start Date</p>
                    <p className="text-[#3b4f73]/80">{jobData.startDate || "Immediate"}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* About Company */}
            <section className="bg-white rounded-lg border border-[#89b4d4]/30 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#3b4f73] mb-4 flex items-center">
                <FaGraduationCap className="mr-2 text-[#89b4d4]" />
                About Company
              </h2>
              <p className="text-[#3b4f73]/80 leading-relaxed">{jobData.about_company || "Company description not available."}</p>
            </section>

            {/* Education Required */}
            <section className="bg-white rounded-lg border border-[#89b4d4]/30 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#3b4f73] mb-4 flex items-center">
                <FaGraduationCap className="mr-2 text-[#89b4d4]" />
                Education Required
              </h2>
              <p className="text-[#3b4f73]/80 leading-relaxed">{jobData.education_required || "N/A"}</p>
            </section>

            {/* Required Skills */}
            <section className="bg-white rounded-lg border border-[#89b4d4]/30 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#3b4f73] mb-4 flex items-center">
                <FaCode className="mr-2 text-[#89b4d4]" />
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {(jobData.skills || []).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#89b4d4]/10 text-[#3b4f73] px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {jobData.required_skills_text && (
                <p className="mt-4 text-[#3b4f73]/80 leading-relaxed">{jobData.required_skills_text}</p>
              )}
            </section>

            {/* Job Description */}
            <section className="bg-white rounded-lg border border-[#89b4d4]/30 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#3b4f73] mb-4 flex items-center">
                <FaTasks className="mr-2 text-[#89b4d4]" />
                Job Description
              </h2>
              <p className="text-[#3b4f73]/80 leading-relaxed whitespace-pre-line">{jobData.description || "Job description not available."}</p>
            </section>
            <button 
  className="bg-[#89b4d4] hover:bg-[#3b4f73] text-white px-6 py-2 rounded-lg font-medium transition-colors"
  onClick={() => setIsModalOpen(true)}
>
  Apply Now
</button>
{isModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="application-modal-title"
  >
    <div className="bg-white rounded-2xl w-full max-w-lg sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
      <div className="p-5 sm:p-6 border-b border-gray-200 flex justify-between items-center">
        <h2
          id="application-modal-title"
          className="text-xl sm:text-2xl font-bold text-gray-900"
        >
          Apply for {jobData.title} at {companyName}
        </h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-xl font-medium"
          aria-label="Close application modal"
        >
          ✕
        </button>
      </div>
      <Application job={jobData} onClose={() => setIsModalOpen(false)} />
    </div>
  </div>
)}


          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SidebarJobSuggest />
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default JobDescription;