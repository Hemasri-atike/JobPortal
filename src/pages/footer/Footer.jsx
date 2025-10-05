import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFooter } from "../../store/footerSlice";
import { Link } from "react-router-dom";
import IHirelogo from "../../assets/MNTechs_logo.png";

const Footer = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.footer);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFooter());
    }
  }, [status, dispatch]);

  if (status === "loading")
    return <p className="text-center py-6">Loading footer...</p>;
  if (status === "failed")
    return <p className="text-center py-6 text-red-500">Failed: {error}</p>;

  const { cta, companyInfo, sections, bottomLinks } = data;

  // ✅ Map all possible link names to correct paths
  const linkPaths = {
    "Browse Jobs": "/jobs",
    "Browse Categories": "/categories",
    "Candidate Dashboard": "/dashboard",
    "Browse Candidates": "/candidates",
    "Employer Dashboard": "/employer-dashboard",
    "Add Job": "/add-job",
    "Job Packages": "/job-packages",
    "About Us": "/about",
    "Job Page Invoice": "/invoice",
    "Terms Page": "/terms",
    Blog: "/blog",
    Contact: "/contact",
  };

  // Bottom links paths (optional override if needed)
  const bottomLinkPaths = {
    "Privacy Policy": "/privacy",
    "Terms of Service": "/terms",
  };

  return (
    <footer className="w-full bg-transparent">
      {/* CTA Section */}
      {cta && (
        <div className="bg-[#1E93AB] border border-[#1E93AB] shadow-lg rounded-2xl w-full max-w-[1180px] mx-auto mb-10 py-10 px-6 sm:px-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {cta.title}
          </h2>
          <p className="text-sm sm:text-base mb-6">{cta.subtitle}</p>
          <Link
            to={cta.ctaLink}
            className="w-full sm:w-auto inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
          >
            {cta.ctaText}
          </Link>
        </div>
      )}

      {/* Main Footer */}
      <div className="py-10 bg-gray-900 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 xl:gap-12">
            {/* Company Info */}
            {companyInfo && (
              <div className="lg:col-span-2 xl:col-span-1">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <div className="rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                    {/* Logo */}
                    <Link
                      to="/"
                      className="flex items-center space-x-3 animate-fade-in"
                    >
                      <img
                        src={IHirelogo}
                        alt="MNTechs Logo"
                        className="w-10 h-10 rounded-full"
                      />
                    </Link>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    I Hire
                  </span>
                </div>
                <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                  <p className="font-semibold text-white">Call us</p>
                  <p className="text-white font-semibold">
                    {companyInfo.phone}
                  </p>
                  <address className="not-italic leading-relaxed">
                    {companyInfo.address}
                  </address>
                  <p className="text-white">{companyInfo.email}</p>
                </div>
              </div>
            )}

            {/* Dynamic Footer Sections */}
            {sections &&
              Object.entries(sections).map(([section, links]) => (
                <div key={section}>
                  <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base capitalize">
                    {section}
                  </h4>
                  <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                    {links.map((item, idx) => {
                      const name = item.name;
                      const path =
                        item.path && item.path !== "#"
                          ? item.path
                          : linkPaths[name] || "#";
                      return (
                        <li key={idx}>
                          <Link
                            to={path}
                            className="hover:text-white transition-colors duration-300"
                          >
                            {name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-4 sm:py-6 border-t border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 text-gray-400 text-xs sm:text-sm flex-wrap">
            <p>&copy; 2024 Ihire. All Rights Reserved.</p>
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
              {bottomLinks &&
                bottomLinks.map((link, idx) => {
                  const path = bottomLinkPaths[link.name] || link.path || "#";
                  return (
                    <Link
                      key={idx}
                      to={path}
                      className="hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
