import React from "react";
import SidebarJobSuggest from "../Employee/SidebarJobSuggest";
import Header from "../../pages/navbar/Header";
import IHireGroup from "../../../src/assets/MNTechs_logo.png";
import { FaBriefcase, FaMapMarkerAlt, FaTasks, FaCode, FaGraduationCap } from "react-icons/fa";
import { Star } from "lucide-react";
import Footer from "../../pages/footer/Footer";

// Sample jobData (replace with API data in a real application)
const defaultJobData = {
  title: "Security Architect",
  company: {
    name: "Accenture",
    logo: IHireGroup,
    rating: 4,
    reviews: 390,
  },
  experience: "5+ Years Experience",
  location: "Bengaluru",
  posted: "1 Week Ago",
  openings: 3,
  applicants: 24,
  aboutCompany: {
    name: "TechCorp",
    description:
      "TechCorp is a leading technology company dedicated to building cutting-edge solutions that empower businesses worldwide. With a focus on innovation, collaboration, and excellence, we create products that transform industries. Join us to be part of a dynamic team shaping the future of technology.",
  },
  overview: {
    role: "Senior Software Engineer",
    type: "Full-time, Permanent",
    experience: "5+ Years",
    location: "Remote (US-based preferred)",
    salary: "$120,000 - $160,000 per year",
  },
  roleDetails: {
    responsibilities: [
      "Design, develop, and maintain scalable web applications.",
      "Collaborate with cross-functional teams to define and implement new features.",
      "Optimize applications for performance and scalability.",
      "Mentor junior engineers and contribute to code reviews.",
      "Ensure the technical feasibility of UI/UX designs.",
      "Stay updated with emerging technologies and industry trends.",
    ],
    requiredSkills: [
      "Proficiency in JavaScript, React, and Node.js.",
      "Experience with RESTful APIs and GraphQL.",
      "Strong understanding of responsive design and CSS frameworks (e.g., Tailwind CSS).",
      "Familiarity with version control systems like Git.",
      "Excellent problem-solving and debugging skills.",
      "Strong communication and teamwork abilities.",
    ],
    education: [
      "Bachelor’s degree in Computer Science, Engineering, or related field (or equivalent experience).",
      "5+ years of professional software development experience.",
      "Proven track record of delivering high-quality software projects.",
      "Experience with cloud platforms (AWS, Azure, or GCP) is a plus.",
    ],
  },
  perks: [
    "Competitive salary and equity options.",
    "Comprehensive health, dental, and vision insurance.",
    "Flexible remote work policy.",
    "Generous paid time off and parental leave.",
    "Professional development stipend for courses and conferences.",
    "Collaborative and inclusive work culture.",
  ],
};

const JobDescription = ({ jobData = defaultJobData }) => {
  return (
    <section className="min-h-screen font-sans bg-[#89b4d4]/10">
      <Header />
      {/* Container */}
      <div className="relative top-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        {/* Header */}
        <header className="max-w-7xl mx-auto mb-7">
          <div className="job-card bg-white rounded-lg border border-[#89b4d4]/30 shadow-sm hover:shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#3b4f73] mb-2">
                {jobData.title}
              </h1>
              <div className="text-[#3b4f73]/80 flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                <span className="font-normal text-sm text-[#3b4f73] leading-relaxed">{jobData.company.name}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < Math.round(jobData.company.rating)
                          ? "text-[#89b4d4] fill-[#89b4d4]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm pl-1 text-[#3b4f73]">{jobData.company.rating}</span>
                </div>
                <span className="font-normal text-sm text-[#3b4f73] leading-relaxed">
                  <span>| </span>({jobData.company.reviews}) Reviews
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <span className="flex items-center font-normal text-sm text-[#3b4f73] leading-relaxed">
                  <FaBriefcase color="#89b4d4"  className="mr-1" /> {jobData.experience}
                </span>
                <span className="flex items-center font-normal text-sm text-[#3b4f73] leading-relaxed">
                  <span className="mr-1"> | </span>
                  <FaMapMarkerAlt color="#89b4d4" className="mr-1" /> {jobData.location}
                </span>
              </div>
              <div className="font-normal text-sm text-[#3b4f73] leading-relaxed">
                <span className="font-medium text-[#3b4f73]">
                  Posted: <span className="font-normal">{jobData.posted}, </span>
                </span>
                <span className="font-medium text-[#3b4f73]">
                  Openings: <span className="font-normal">{jobData.openings}, </span>
                </span>
                <span className="font-medium text-[#3b4f73]">
                  Applicants: <span className="font-normal">{jobData.applicants} </span>
                </span>
              </div>
            </div>
            <div>
              <div className="w-full flex-shrink-0 justify-center items-center mb-5">
                <img
                  src={jobData.company.logo}
                  alt="Company Logo"
                  className="w-full max-w-[90px] rounded-lg border border-[#89b4d4]/20 p-1 h-auto object-contain"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                <button className="inline-block text-xs font-medium text-[#3b4f73] bg-[#89b4d4]/10 px-4 py-2 rounded-full hover:bg-[#89b4d4] hover:text-[#ffffff] transition-all duration-300">
                  Register to apply
                </button>
                <button className="inline-block text-xs font-medium px-4 py-2 rounded-full bg-[#89b4d4] text-[#ffffff] transition-all duration-300">
                  Login to apply
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Info */}
            <section className="bg-[#ffffff] border border-[#89b4d4]/20 rounded-2xl shadow-sm hover:shadow-md p-6 sm:p-8 transition-all">
              <h2 className="text-base font-medium text-[#3b4f73] mb-4">
                About {jobData.aboutCompany.name}
              </h2>
              <p className="font-normal text-sm text-[#3b4f73] leading-relaxed">
                {jobData.aboutCompany.description}
              </p>
            </section>

            {/* Job Overview */}
            <section className="bg-[#ffffff] border border-[#89b4d4]/20 rounded-2xl shadow-sm hover:shadow-md p-6 sm:p-8 transition-all">
              <h2 className="text-base font-medium text-[#3b4f73] mb-4">
                Job Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-3">
                  <p className="font-normal text-sm text-[#3b4f73] leading-relaxed">
                    <span className="font-medium text-[#3b4f73]">Role:</span> {jobData.overview.role}
                  </p>
                  <p className="font-normal text-sm text-[#3b4f73] leading-relaxed">
                    <span className="font-medium text-[#3b4f73]">Type:</span> {jobData.overview.type}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="font-normal text-sm text-[#3b4f73] leading-relaxed">
                    <span className="font-medium text-[#3b4f73]">Experience:</span> {jobData.overview.experience}
                  </p>
                  <p className="font-normal text-sm text-[#3b4f73] leading-relaxed">
                    <span className="font-medium text-[#3b4f73]">Location:</span> {jobData.overview.location}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-normal text-sm text-[#3b4f73] leading-relaxed">
                    <span className="font-medium text-[#3b4f73]">Salary:</span> {jobData.overview.salary}
                  </p>
                </div>
              </div>
            </section>

            {/* Role Details */}
            <section className="bg-[#ffffff] border border-[#89b4d4]/20 rounded-2xl shadow-sm hover:shadow-md p-6 sm:p-8 transition-all">
              <h2 className="text-base font-medium text-[#3b4f73] mb-6">
                Role Details
              </h2>
              <div className="space-y-6">
                {/* Responsibilities Subsection */}
                <div>
                  <h3 className="text-base font-medium text-[#3b4f73] mb-3 flex items-center cursor-pointer hover:text-[#89b4d4] transition-colors duration-200">
                    <FaTasks color="#89b4d4" className="mr-2" /> Responsibilities
                  </h3>
                  <ul className="list-none space-y-2 pl-4">
                    {jobData.roleDetails.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#89b4d4] mr-2">•</span>
                        <span className="font-normal text-sm text-[#3b4f73] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Skills Subsection */}
                <div>
                  <h3 className="text-base font-medium text-[#3b4f73] mb-3 flex items-center cursor-pointer hover:text-[#89b4d4] transition-colors duration-200">
                    <FaCode color="#89b4d4" className="mr-2" /> Required Skills
                  </h3>
                  <ul className="list-none space-y-2 pl-4">
                    {jobData.roleDetails.requiredSkills.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#89b4d4] mr-2">•</span>
                        <span className="font-normal text-sm text-[#3b4f73] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Education & Qualifications Subsection */}
                <div>
                  <h3 className="text-base font-medium text-[#3b4f73] mb-3 flex items-center cursor-pointer hover:text-[#89b4d4] transition-colors duration-200">
                    <FaGraduationCap color="#89b4d4" className="mr-2" /> Education & Qualifications
                  </h3>
                  <ul className="list-none space-y-2 pl-4">
                    {jobData.roleDetails.education.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#89b4d4] mr-2">•</span>
                        <span className="font-normal text-sm text-[#3b4f73] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Perks & Benefits */}
            <section className="bg-[#ffffff] border border-[#89b4d4]/20 rounded-2xl shadow-sm hover:shadow-md p-6 sm:p-8 transition-all">
              <h2 className="text-base font-medium text-[#3b4f73] mb-4">
                Perks & Benefits
              </h2>
              <ul className="list-none space-y-3">
                {jobData.perks.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#89b4d4] mr-2">•</span>
                    <span className="font-normal text-sm text-[#3b4f73] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Apply Now */}
            <section className="bg-gradient-to-r border border-[#89b4d4]/20 from-[#3b4f73] to-[#89b4d4] rounded-2xl shadow-sm hover:shadow-md p-6 sm:p-8 text-center transition-all">
              <h2 className="text-base font-medium uppercase text-[#ffffff] mb-2">
                Ready to Join Us?
              </h2>
              <p className="font-normal text-sm text-[#ffffff] leading-relaxed mb-6">
                If you’re excited about building innovative solutions and growing with a passionate team, we’d love to hear from you!
              </p>
              <a
                href="/jobapplication"
                className="inline-block bg-[#ffffff] text-base font-medium text-[#3b4f73] py-2 px-6 rounded-full hover:bg-[#89b4d4] hover:text-[#ffffff] transition-all duration-300 transform hover:-translate-y-1"
              >
                Apply Now
              </a>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SidebarJobSuggest />
          </div>
        </div>
      </div>
      <div className="pt-9"><Footer /></div>
    </section>
  );
};

export default JobDescription;