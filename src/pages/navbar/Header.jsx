import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchHeader } from "../../store/headerSlice";
import { logoutUser } from "../../store/userSlice";
import UserType from "../../login/UserType";
import { X, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, status, error } = useSelector((state) => state.header);
  const { userInfo } = useSelector((state) => state.user);

  // Fetch header data
  useEffect(() => {
    if (status === "idle") dispatch(fetchHeader());
  }, [status, dispatch]);

  // Close login popup automatically after login
  useEffect(() => {
    if (userInfo) setIsLoginPopupOpen(false);
  }, [userInfo]);

  if (status === "loading") return <p className="text-center py-6">Loading header...</p>;
  if (status === "failed") return <p className="text-center py-6 text-red-500">{error}</p>;

  const { logo } = data || {};

 

  const goToProfile = () => {
  if (!userInfo) return;
  const role = userInfo.role?.toLowerCase();
  const route = role === "employee" ? "/cadprofile" : "/empprofile";
  navigate(route);
  setIsMenuOpen(false);
};

const AvatarName = () => (
  <div
    className="flex items-center cursor-pointer space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
    onClick={goToProfile}
  >
    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
      {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
    </div>
    <span className="text-black font-medium hover:text-yellow-500">
      {userInfo?.name || "User"}
    </span>
  </div>
);


  // Render links
  const renderLink = ({ label, to, type }, isMobile = false) => {
    if (type === "popup") {
      return !userInfo ? (
        <div
          key={label}
          className={`cursor-pointer ${isMobile ? "" : "p-2"}`}
          onClick={() => setIsLoginPopupOpen(true)}
        >
          <User className="w-6 h-6 text-black hover:text-yellow-500" />
        </div>
      ) : null;
    }

    if (label === "Logout") {
      return (
        <div
          key={label}
          className="px-4 py-1 rounded-md font-semibold cursor-pointer"
          onClick={() => {
            dispatch(logoutUser());
            navigate("/");
            if (isMobile) setIsMenuOpen(false);
          }}
        >
          <button className="w-full h-full text-left">{label}</button>
        </div>
      );
    }

    return to ? (
      <Link
        key={label}
        to={to}
        className="px-4 py-1 rounded-md font-semibold"
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        {label}
      </Link>
    ) : (
      <button key={label} className="px-4 py-1 rounded-md font-semibold">
        {label}
      </button>
    );
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-[#1E3A8A] font-bold text-lg">{logo?.text?.charAt(0) || "I"}</span>
            </div>
            <span className="text-xl font-bold text-black">{logo?.text || "Hire"}</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/jobsearch"
              className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 font-semibold"
            >
              Find a Job
            </Link>
            <Link
              to="/login?type=employee"
              className="bg-yellow-400 text-[#1E3A8A] px-4 py-1 rounded-md hover:bg-yellow-500 font-semibold"
            >
              Hire a Staff
            </Link>

            {!userInfo && renderLink({ label: "Login", type: "popup" })}
            {userInfo && (
              <>
                <AvatarName />
                {renderLink({ label: "Logout" })}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                  isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                }`}
              ></span>
              <span
                className={`bg-black h-0.5 w-6 rounded-sm my-0.5 transition-all duration-300 ease-out ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                  isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                }`}
              ></span>
            </div>
          </button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col space-y-3">
            <Link
              to="/jobsearch"
              className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Find a Job
            </Link>
            <Link
              to="/login?type=employee"
              className="bg-yellow-400 text-[#1E3A8A] px-4 py-1 rounded-md hover:bg-yellow-500 font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Hire a Staff
            </Link>

            {!userInfo && renderLink({ label: "Login", type: "popup" }, true)}
            {userInfo && (
              <>
                <div onClick={goToProfile}>
                  <AvatarName />
                </div>
                {renderLink({ label: "Logout" }, true)}
              </>
            )}
          </div>
        )}
      </div>

      {/* Login popup */}
      {isLoginPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full m-4">
            <button
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setIsLoginPopupOpen(false)}
              aria-label="Close login popup"
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
