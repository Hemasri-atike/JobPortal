import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createJob, updateJob } from '../../store/jobsSlice.js';
import { fetchCategories } from '../../store/categoriesSlice.js';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmpPosting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const job = state?.job;
  

  const { categories, status: categoriesStatus, error: categoriesError } = useSelector((state) => state.categories || {});
const { jobsStatus, jobsError } = useSelector((state) => state.jobs || {});

  const { userInfo, userType } = useSelector((state) => state.user || {});
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    description: '',
    category: '',
    salary: '',
    type: '',
    experience: '',
    deadline: '',
    tags: [],
    status: 'Active',
    contactPerson: '',
    role: '',
    startDate: '',
    vacancies: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!userInfo || !userType || (userType !== 'employer' && userType !== 'admin')) {
      toast.error('Unauthorized access.', { position: 'top-right', autoClose: 3000 });
      navigate('/login');
      return;
    }
    dispatch(fetchCategories());
  }, [dispatch, userInfo, userType, navigate]);

  useEffect(() => {
    if (id && job) {
      setFormData({
        title: job.title || '',
        company_name: job.company_name || '',
        location: job.location || '',
        description: job.description || '',
        category: job.category || '',
        salary: job.salary || '',
        type: job.type || '',
        experience: job.experience || '',
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
        tags: job.tags || [],
        status: job.status || 'Active',
        contactPerson: job.contactPerson || '',
        role: job.role || '',
        startDate: job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : '',
        vacancies: job.vacancies || '',
      });
    }
  }, [id, job]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Job Title is required';
    if (!formData.company_name) newErrors.company_name = 'Company Name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description) newErrors.description = 'Job Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim()).filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    try {
      if (id) {
        await dispatch(updateJob({ id, ...formData })).unwrap();
        toast.success('Job updated successfully.', { position: 'top-right', autoClose: 3000 });
      } else {
        await dispatch(createJob({ ...formData, userId: userInfo.id })).unwrap();
        toast.success('Job created successfully.', { position: 'top-right', autoClose: 3000 });
      }
      navigate('/joblistings');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err?.message || `Failed to ${id ? 'update' : 'create'} job.`, { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
          {id ? 'Edit Job Posting' : 'Create a New Job Posting'}
        </h1>

        {jobsStatus === 'failed' && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            {jobsError || 'An error occurred while processing your request.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Frontend Developer"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${errors.company_name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Tech Corp"
                />
                {errors.company_name && <p className="mt-1 text-sm text-red-500">{errors.company_name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Mumbai, India"
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={categoriesStatus === 'loading' || categories.length === 0}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    // <option key={category} value={category}>{category}</option>
                    <option key={category.name} value={category.name}>
  {category.name}
</option>

                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Describe the job responsibilities, requirements, and perks..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary (INR)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., 2-5 years"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vacancies</label>
                <input
                  type="number"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., 3"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., React, Node, Remote"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., John Doe, HR Manager"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., Frontend Developer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/joblisting')}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={jobsStatus === 'loading'}
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {jobsStatus === 'loading' ? 'Submitting...' : id ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
      </div>
    </div>
  );
};

export default EmpPosting;