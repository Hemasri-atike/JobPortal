import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Register = () => {
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
            <Link to="/register?type=candidate" className="text-blue-600 hover:underline">Candidate</Link>
            <Link to="/register?type=employee" className="text-blue-600 hover:underline">Employee</Link>
          </div>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: userType,
    companyId: '',
    position: '',
    skills: [],
    experience: 0,
    location: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate successful registration by saving to localStorage
      localStorage.setItem('candidateProfile', JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: '', // Add phone input if needed
        designation: formData.position || 'Job Seeker',
        company: formData.companyId ? `Company ${formData.companyId}` : '',
        location: formData.location,
        about: `Candidate with ${formData.experience} years of experience in ${formData.skills.join(', ')}`,
      }));
      navigate('/cadprofile'); // Navigate to candidate profile
    } catch (error) {
      setLocalError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            {userType === 'employee' ? 'Employee Registration' : 'Candidate Registration'}
          </h2>
          <p className="text-sm text-gray-500">
            {userType === 'employee' 
              ? 'Create your company account to post jobs' 
              : 'Join thousands of job seekers'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Re-enter your password"
                required
              />
            </div>
          </div>

          {userType === 'employee' ? (
            <>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Position
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., HR Manager, Recruiter"
                  required
                />
              </div>
              <div>
                <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select your company</option>
                  <option value="1">TechCorp</option>
                  <option value="2">DesignStudio</option>
                  <option value="3">CloudTech</option>
                  <option value="4">StartupXYZ</option>
                  <option value="5">DataCorp</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., San Francisco, CA"
                  required
                />
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  onChange={handleSkillsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., React, TypeScript, Node.js"
                />
              </div>
            </>
          )}

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
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="flex items-center justify-center my-4">
            <span className="border-t border-gray-300 w-full"></span>
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <span className="border-t border-gray-300 w-full"></span>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to={`/login?type=${userType}`}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link
              to={userType === 'employee' ? '/register?type=candidate' : '/register?type=employee'}
              className="text-sm text-gray-600 hover:underline"
            >
              {userType === 'employee' 
                ? 'Looking for a job? Register as a candidate' 
                : 'Are you an employer? Register as an employee'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;