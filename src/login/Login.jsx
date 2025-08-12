import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract type from query parameters, default to 'candidate' if undefined or invalid
  const queryParams = new URLSearchParams(location.search);
  const userType = ['candidate', 'employee'].includes(queryParams.get('type'))
    ? queryParams.get('type')
    : 'candidate';

  // Fallback UI for invalid userType (optional, for debugging)
  if (!['candidate', 'employee'].includes(userType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid User Type</h2>
          <p className="text-gray-600 mt-2">Please select a valid user type:</p>
          <div className="mt-4 space-x-4">
            <Link to="/login?type=candidate" className="text-blue-600 hover:underline">Candidate</Link>
            <Link to="/login?type=employee" className="text-blue-600 hover:underline">Employee</Link>
          </div>
        </div>
      </div>
    );
  }

  const from = location.state?.from?.pathname || 
    (userType === 'employee' ? '/employee-dashboard' : '/candidate-dashboard');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    try {
      console.log('Login attempt:', { email, password, userType });
      navigate(from, { replace: true });
    } catch (error) {
      setLocalError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            {userType === 'employee' ? 'Employee Login' : 'Candidate Login'}
          </h2>
          <p className="text-sm text-gray-500">
            {userType === 'employee' 
              ? 'Access your company dashboard' 
              : 'Welcome back! Please log in to find your dream job.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {localError && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg">
              {localError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="flex items-center justify-center my-4">
            <span className="border-t border-gray-300 w-full"></span>
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <span className="border-t border-gray-300 w-full"></span>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to={`/register?type=${userType}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link
              to={userType === 'employee' ? '/login?type=candidate' : '/login?type=employee'}
              className="text-sm text-gray-600 hover:underline"
            >
              {userType === 'employee' 
                ? 'Looking for a job? Switch to candidate login' 
                : 'Are you an employer? Switch to employee login'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;