import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchHeader } from "../../store/headerSlice";
import { logoutUser } from "../../store/userSlice";
import UserType from "../../login/UserType";
import { X, User, Menu } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const popupRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, status, error } = useSelector((state) => state.header);
  const { userInfo } = useSelector((state) => state.user);

  // Fetch header data
  useEffect(() => {
    if (status === "idle") dispatch(fetchHeader());
  }, [status, dispatch]);

  // Close login popup and mobile menu after login
  useEffect(() => {
    if (userInfo) {
      setIsLoginPopupOpen(false);
      setIsMenuOpen(false);
    }
  }, [userInfo]);

  // Focus trapping for login popup
  useEffect(() => {
    if (isLoginPopupOpen && popupRef.current) {
      const focusableElements = popupRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
        if (e.key === "Escape") {
          setIsLoginPopupOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      firstElement?.focus();

      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isLoginPopupOpen]);

  if (status === "loading") {
    return (
      <p className="text-center py-8 text-gray-600 text-lg">
        Loading header...
      </p>
    );
  }
  if (status === "failed") {
    return (
      <p className="text-center py-8 text-red-600 text-lg">
        {error || "Failed to load header"}
      </p>
    );
  }

  const { logo } = data || {};

  const goToProfile = () => {
    if (!userInfo) return;
    const role = userInfo.role?.toLowerCase();
    const route =
      role === "job_seeker"
        ? "/cadprofile"
        : role === "employer"
        ? "/cmpprofile"
        : "/profile";
    navigate(route);
    setIsMenuOpen(false);
  };

  const AvatarName = () => (
    <div
      className="flex items-center cursor-pointer space-x-3 px-3 py-2 rounded-lg hover:bg-pink-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
      onClick={goToProfile}
      onKeyDown={(e) => e.key === "Enter" && goToProfile()}
      tabIndex={0}
      aria-label={`Go to ${userInfo?.name || "User"}'s profile`}
    >
      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
        {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
      </div>
      <span className="text-gray-900 font-medium hover:text-purple-500 text-sm">
        {userInfo?.name || "User"}
      </span>
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 animate-fade-in">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
              <span>{logo?.text?.charAt(0) || "H"}</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {logo?.text || "Hire"}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login?type=candidate"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors text-sm font-semibold"
              aria-label="Find a job"
            >
              Find a Job
            </Link>
            <Link
              to="/login?type=employer"
              className="bg-purple-500 text-white px-5 py-2.5 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-sm font-semibold"
              aria-label="Post a job"
            >
              Post a Job
            </Link>
            {!userInfo && (
              <button
                className="p-2 rounded-lg hover:bg-pink-500/20 transition-colors"
                onClick={() => setIsLoginPopupOpen(true)}
                aria-label="Open login popup"
              >
                <User className="w-6 h-6 text-gray-900 hover:text-purple-500" />
              </button>
            )}
            {userInfo && (
              <>
                <AvatarName />
                <button
                  className="px-5 py-2.5 rounded-lg text-gray-900 hover:text-purple-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                  onClick={() => {
                    dispatch(logoutUser());
                    setIsMenuOpen(false);
                    setTimeout(() => navigate("/home"), 50); // redirect safely after logout
                  }}
                  aria-label="Log out"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {!userInfo && (
              <button
                className="p-2 rounded-lg hover:bg-pink-500/20 transition-colors"
                onClick={() => setIsLoginPopupOpen(true)}
                aria-label="Open login popup"
              >
                <User className="w-6 h-6 text-gray-900 hover:text-purple-500" />
              </button>
            )}
            <button
              className="p-2 rounded-lg hover:bg-pink-500/20 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu
                className={`w-6 h-6 text-gray-900 transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white animate-slide-down">
            <div className="flex flex-col space-y-3 px-4">
              <Link
                to="/login?type=candidate"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors text-base font-semibold"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Find a job"
              >
                Find a Job
              </Link>
              <Link
                to="/login?type=employee"
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-base font-semibold"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Post a job"
              >
                Post a Job
              </Link>
              {userInfo && (
                <>
                  <div onClick={goToProfile}>
                    <AvatarName />
                  </div>
                  <button
                    className="text-left px-6 py-3 rounded-lg text-gray-900 hover:text-purple-500 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                    onClick={() => {
                      dispatch(logoutUser());
                      setIsMenuOpen(false);
                      setTimeout(() => navigate("/home"), 50); // redirect safely after logout
                    }}
                    aria-label="Log out"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {isLoginPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div
            ref={popupRef}
            className="relative bg-white/90 rounded-2xl shadow-xl max-w-md w-full m-4 p-6 animate-fade-in"
          >
            <button
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-pink-500/20 transition-colors"
              onClick={() => setIsLoginPopupOpen(false)}
              aria-label="Close login popup"
            >
              <X className="w-5 h-5 text-gray-600 hover:text-purple-500" />
            </button>
            <UserType />
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
