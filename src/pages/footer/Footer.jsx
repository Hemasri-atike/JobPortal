const Footer = () => {
  const footerSections = {
    candidates: [
      'Browse Jobs', 'Browse Categories', 'Candidate Dashboard', 'Job Alerts', 'My Bookmarks'
    ],
    employers: [
      'Browse Candidates', 'Employer Dashboard', 'Add Job', 'Job Packages'
    ],
    about: [
      'About Us', 'Job Page Invoice', 'Terms Page', 'Blog', 'Contact'
    ],
    resources: [
      'Site Map', 'Terms of Use', 'Privacy Center', 'Security Center', 'Accessibility Center'
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* CTA Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center lg:text-left lg:mx-0">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Recruiting?
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base lg:text-lg">
              Advertise your jobs to millions of monthly users and search 15.8 million 
              CVs in our database.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-md transition-colors">
              Start Recruiting Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-5 xl:gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-2 xl:col-span-1">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">S</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">MnTechs</span>
              </div>
              <div className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <p className="font-semibold text-gray-900">Call us</p>
                <p className="text-blue-600 font-semibold">123 456 7890</p>
                <address className="not-italic leading-relaxed">
                  329 Queensberry Street, North Melbourne VIC<br />
                  3051, Australia.
                </address>
                <p>support@MnTechs.com</p>
              </div>
            </div>

            {/* For Candidates */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                For Candidates
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                {footerSections.candidates.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                For Employers
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                {footerSections.employers.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                About Us
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                {footerSections.about.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Helpful Resources */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                Helpful Resources
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                {footerSections.resources.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-4 sm:py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-600 text-xs sm:text-sm">
            <p>&copy; 2024 MnTechs. All Rights Reserved.</p>
            <div className="flex items-center gap-4 sm:gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
