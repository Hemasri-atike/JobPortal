const Footer = () => {
  const footerSections = {
    candidates: [
      "Browse Jobs",
      "Browse Categories",
      "Candidate Dashboard",
      "Job Alerts",
      "My Bookmarks",
    ],
    employers: ["Browse Candidates", "Employer Dashboard", "Add Job", "Job Packages"],
    about: ["About Us", "Job Page Invoice", "Terms Page", "Blog", "Contact"],
  };

  return (
    <footer className="bg-gray-900 text-gray-200">
      {/* CTA Section */}
      <div className="bg-blue-600 py-10 sm:py-16 text-center text-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Find Your Dream Job Today
        </h2>
        <p className="text-sm sm:text-base mb-6">
          Browse thousands of job opportunities and connect with top employers.
        </p>
        <a
          href="#"
          className="w-full sm:w-auto inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Browse Jobs
        </a>
      </div>

      {/* Main Footer */}
      <div className="py-10 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 xl:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2 xl:col-span-1">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                  I
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white">hire</span>
              </div>
              <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                <p className="font-semibold text-white">Call us</p>
                <p className="text-white font-semibold">123 456 7890</p>
                <address className="not-italic leading-relaxed">
                  401, 8-3-6-5/1/1/4, Astral Hasini Residency, J.P. Nagar, Hyderabad - 500073, Telangana
                </address>
                <p className="text-white">support@ihire.com</p>
              </div>
            </div>

            {/* Dynamic Footer Sections */}
            {footerSections &&
              Object.entries(footerSections).map(([section, links]) => (
                <div key={section}>
                  <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base capitalize">
                    {section}
                  </h4>
                  <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                    {links.map((item, idx) => (
                      <li key={idx}>
                        <a
                          href="#"
                          className="hover:text-white transition-colors duration-300"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
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
              <a href="#" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
