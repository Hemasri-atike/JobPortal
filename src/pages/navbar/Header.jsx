import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/userSlice.js'; 
import UserType from '../../login/UserType';
import { X } from "lucide-react";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { userInfo } = useSelector((state) => state.user);

  // Navigation links
  const navLinks = [
    { to: '/jobsearch', label: 'Find Jobs' },
  ];

  // Action buttons (change if logged in)
  const actionLinks = userInfo
    ? [
        {
          label: `Hi, ${userInfo.name || "User"}`,
          isButton: false,
          onClick: () => navigate("/profile"), // go to profile page
        },
        {
          label: 'Logout',
          isButton: true,
          onClick: () => {
            dispatch(logoutUser());
            navigate("/");
          },
        },
      ]
    : [
        {
          label: 'Login',
          isButton: false,
          onClick: () => setIsLoginPopupOpen(true),
        },
        { to: '/jobsearch', label: 'Find a Job', isButton: true },
        { to: '/login?type=employee', label: 'Hire Staff', isButton: true },
      ];

  // Render function
  const renderLink = ({ to, label, isButton, onClick }, isMobile = false) => (
    <div
      key={to || label}
      className={`${
        isButton
          ? 'bg-yellow-400 text-[#1E3A8A] px-4 py-1 rounded-md hover:bg-yellow-500 font-semibold'
          : 'text-black hover:text-yellow-300'
      } transition-colors text-sm ${isMobile ? 'py-2 px-3 text-left' : ''}`}
      onClick={onClick || (isMobile && (() => setIsMenuOpen(false)))}
    >
      {to ? (
        <Link to={to} className="w-full h-full flex items-center">
          {label}
        </Link>
      ) : (
        <button className="w-full h-full text-left">{label}</button>
      )}
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-[#1E3A8A] font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold text-black">Hire</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => renderLink(link))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {actionLinks.map((link) => renderLink(link))}
          </div>

          {/* Mobile menu btn */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                  isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                }`}
              ></span>
              <span
                className={`bg-black h-0.5 w-6 rounded-sm my-0.5 transition-all duration-300 ease-out ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span
                className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                  isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                }`}
              ></span>
            </div>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => renderLink(link, true))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                {actionLinks.map((link) => renderLink(link, true))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Popup */}
      {isLoginPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full m-4">
            {/* Close */}
            {/* <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsLoginPopupOpen(false)}
            >
              ✕
            </button> */}
            <button
  className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
  onClick={() => setIsLoginPopupOpen(false)}
>
  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
</button>

            <UserType />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
