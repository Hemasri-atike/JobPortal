import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-[#1E3A8A] font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold text-black">Hire</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/jobsearch"
              className="text-black hover:text-yellow-300 transition-colors"
            >
              Find Jobs
            </Link>
            {/* <Link
              to="/companies"
              className="text-black hover:text-yellow-300 transition-colors"
            >
              Companies
            </Link> */}
            {/* <Link
              to="/about"
              className="text-black hover:text-yellow-300 transition-colors"
            >
              About
            </Link> */}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <Link
              to="/upload-cv"
              className="text-black hover:text-yellow-300 px-3 py-1 rounded-md transition-colors text-sm"
            >
              Upload CV
            </Link> */}
            <Link
              to="/"
              className="text-black hover:text-yellow-300 px-3 py-1 rounded-md transition-colors text-sm"
            >
              Login
            </Link>
            <Link
              to="/empposting"
              className="bg-yellow-400 text-[#1E3A8A] px-4 py-1 rounded-md hover:bg-yellow-500 transition-colors text-sm font-semibold"
            >
              Post a Job
            </Link>
            <Link
              to="/hirestaff"
              className="bg-yellow-400 text-[#1E3A8A] px-4 py-1 rounded-md hover:bg-yellow-500 transition-colors text-sm font-semibold"
            >
              Hire Staff
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                }`}
              ></span>
              <span
                className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span
                className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                }`}
              ></span>
            </div>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/jobs"
                className="text-black hover:text-yellow-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Jobs
              </Link>
              {/* <Link
                to="/companies"
                className="text-black hover:text-yellow-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Companies
              </Link> */}
              {/* <Link
                to="/about"
                className="text-black hover:text-yellow-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link> */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                {/* <Link
                  to="/upload-cv"
                  className="text-black hover:text-yellow-300 px-3 py-2 rounded-md transition-colors text-left text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Upload CV
                </Link> */}
                <Link
                  to="/login"
                  className="text-black hover:text-yellow-300 px-3 py-2 rounded-md transition-colors text-left text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/login?type=employee"
                  className="bg-yellow-400 text-[#1E3A8A] px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors text-left text-sm font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post a Job
                </Link>
                <Link
                  to="/hirestaff"
                  className="bg-yellow-400 text-[#1E3A8A] px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors text-left text-sm font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hire Staff
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;