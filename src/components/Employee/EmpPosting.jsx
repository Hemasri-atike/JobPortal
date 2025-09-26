import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createJob, updateJob } from '../../store/jobsSlice.js';
import { fetchCategories, fetchSubcategories } from '../../store/categoriesSlice.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Select from 'react-select';

const EmpPosting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const job = state?.job || {};

  const {
    categories = [],
    categoriesStatus = 'idle',
    subcategories = [],
    subcategoriesStatus = 'idle',
    error: categoriesError = null,
  } = useSelector((state) => state.categories || {});
  const {
    jobsStatus = 'idle',
    jobsError = null,
    updateJobError = null,
    updateJobSuccess = false,
  } = useSelector((state) => state.jobs || {});
  const { userInfo = null, userType = null } = useSelector((state) => state.user || {});

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    description: '',
    category_id: '',
    subcategory_id: '',
    salary: 0,
    type: '',
    experience: '',
    deadline: '',
    skills: [],
    status: 'Active',
    contactPerson: '',
    role: '',
    startDate: '',
    vacancies: 1,
  });
  const [errors, setErrors] = useState({});
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillsStatus, setSkillsStatus] = useState('idle'); // Track skills fetching status

  useEffect(() => {
    const fetchSkills = async () => {
      setSkillsStatus('loading');
      try {
        const response = await axios.get('http://localhost:5000/api/jobs/skills');
        console.log('Skills fetched:', response.data);
        const skills = Array.isArray(response.data) ? response.data : [];
        setAvailableSkills(skills);
        setSkillsStatus('succeeded');
      } catch (err) {
        console.error('Error fetching skills:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        toast.error(err.response?.data?.error || 'Failed to fetch skills.', {
          position: 'top-right',
          autoClose: 3000,
        });
        setAvailableSkills([]);
        setSkillsStatus('failed');
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    if (!userInfo || !userType || (userType !== 'employer' && userType !== 'admin')) {
      toast.error('Unauthorized access.', { position: 'top-right', autoClose: 3000 });
      navigate('/login');
      return;
    }
    if (categoriesStatus === 'idle' && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, userInfo, userType, navigate, categoriesStatus, categories.length]);

  useEffect(() => {
    if (formData.category_id) {
      dispatch(fetchSubcategories(formData.category_id));
    } else {
      dispatch({ type: 'categories/resetSubcategories' });
    }
  }, [dispatch, formData.category_id]);

  useEffect(() => {
    if (id && job && skillsStatus === 'succeeded' && availableSkills.length > 0) {
      const category = categories.find((cat) => cat.id === job.category_id);
      const subcategory = subcategories.find((sub) => sub.id === job.subcategory_id);
      const validSkills = Array.isArray(job.skills)
        ? job.skills.filter((skill) => availableSkills.includes(skill))
        : [];
      console.log('Initializing formData for job:', {
        jobId: job.id,
        jobSkills: job.skills,
        availableSkills,
        validSkills,
      });
      setFormData({
        title: job.title || '',
        company_name: job.company_name || '',
        location: job.location || '',
        description: job.description || '',
        category_id: category ? String(category.id) : '',
        subcategory_id: subcategory ? String(subcategory.id) : '',
        salary: job.salary || 0,
        type: job.type || '',
        experience: job.experience || '',
        deadline: job.deadline && !isNaN(new Date(job.deadline))
          ? new Date(job.deadline).toISOString().split('T')[0]
          : '',
        skills: validSkills,
        status: job.status || 'Active',
        contactPerson: job.contactPerson || '',
        role: job.role || '',
        startDate: job.startDate && !isNaN(new Date(job.startDate))
          ? new Date(job.startDate).toISOString().split('T')[0]
          : '',
        vacancies: job.vacancies || 1,
      });
      if (category && !subcategories.length && formData.category_id) {
        dispatch(fetchSubcategories(category.id));
      }
    }
  }, [id, job, categories, subcategories, dispatch, availableSkills, skillsStatus]);

  useEffect(() => {
    if (updateJobSuccess) {
      toast.success('Job updated successfully.', { position: 'top-right', autoClose: 3000 });
      navigate('/joblistings');
    }
    if (updateJobError) {
      const errorMessage = updateJobError.message || updateJobError.data?.error || 'Failed to update job.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
    }
  }, [updateJobSuccess, updateJobError, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'category_id' || name === 'subcategory_id' ? String(value) : value,
      ...(name === 'category_id' ? { subcategory_id: '' } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: '', ...(name === 'category_id' ? { subcategory_id: '' } : {}) }));
  };

  // Handle skills change with react-select
  const handleSkillsChange = (selectedOptions) => {
    const selectedSkills = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData((prev) => ({ ...prev, skills: selectedSkills }));
    setErrors((prev) => ({ ...prev, skills: '' }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];
    if (!formData.title) newErrors.title = 'Job Title is required';
    if (!formData.company_name) newErrors.company_name = 'Company Name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description) newErrors.description = 'Job Description is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.subcategory_id && formData.category_id && subcategories.length > 0)
      newErrors.subcategory_id = 'Subcategory is required';
    if (!formData.type) newErrors.type = 'Job Type is required';
    if (!formData.deadline) newErrors.deadline = 'Application Deadline is required';
    if (formData.deadline && formData.deadline < today)
      newErrors.deadline = 'Deadline must be a future date';
    if (formData.salary < 0) newErrors.salary = 'Salary cannot be negative';
    if (formData.vacancies < 1) newErrors.vacancies = 'Vacancies must be at least 1';
    if (!formData.skills || formData.skills.length === 0)
      newErrors.skills = 'At least one skill is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const payload = {
        ...formData,
        userId: userInfo?.id || 1,
      };
      delete payload.category;
      delete payload.subcategory;
      if (id) {
        await dispatch(updateJob({ id, ...payload, config })).unwrap();
      } else {
        await dispatch(createJob({ ...payload, config })).unwrap();
        toast.success('Job created successfully.', { position: 'top-right', autoClose: 3000 });
        setFormData({
          title: '',
          company_name: '',
          location: '',
          description: '',
          category_id: '',
          subcategory_id: '',
          salary: 0,
          type: '',
          experience: '',
          deadline: '',
          skills: [],
          status: 'Active',
          contactPerson: '',
          role: '',
          startDate: '',
          vacancies: 1,
        });
      }
    } catch (err) {
      const errorMessage = err.message?.includes('network')
        ? 'Network error. Please check your connection.'
        : err.message || `Failed to ${id ? 'update' : 'create'} job.`;
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
          {id ? 'Edit Job Posting' : 'Create a New Job Posting'}
        </h1>

        {(jobsStatus === 'failed' || categoriesStatus === 'failed' || skillsStatus === 'failed') && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            {jobsError || categoriesError || 'An error occurred while processing your request.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Frontend Developer"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  aria-required="true"
                />
                {errors.title && (
                  <p id="title-error" className="mt-1 text-sm text-red-500">
                    {errors.title}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="company_name"
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${
                    errors.company_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Tech Corp"
                  aria-invalid={!!errors.company_name}
                  aria-describedby={errors.company_name ? 'company_name-error' : undefined}
                  aria-required="true"
                />
                {errors.company_name && (
                  <p id="company_name-error" className="mt-1 text-sm text-red-500">
                    {errors.company_name}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mumbai, India"
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? 'location-error' : undefined}
                  aria-required="true"
                />
                {errors.location && (
                  <p id="location-error" className="mt-1 text-sm text-red-500">
                    {errors.location}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  disabled={categoriesStatus === 'loading' || categories.length === 0}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.category_id}
                  aria-describedby={errors.category_id ? 'category_id-error' : undefined}
                  aria-required="true"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categoriesStatus === 'loading' && (
                  <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
                )}
                {errors.category_id && (
                  <p id="category_id-error" className="mt-1 text-sm text-red-500">
                    {errors.category_id}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  id="subcategory_id"
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleChange}
                  disabled={subcategoriesStatus === 'loading' || subcategories.length === 0 || !formData.category_id}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.subcategory_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.subcategory_id}
                  aria-describedby={errors.subcategory_id ? 'subcategory_id-error' : undefined}
                  aria-required="true"
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                {subcategoriesStatus === 'loading' && (
                  <p className="mt-1 text-sm text-gray-500">Loading subcategories...</p>
                )}
                {errors.subcategory_id && (
                  <p id="subcategory_id-error" className="mt-1 text-sm text-red-500">
                    {errors.subcategory_id}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the job responsibilities, requirements, and perks..."
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
                aria-required="true"
              />
              {errors.description && (
                <p id="description-error" className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills <span className="text-red-500">*</span>
              </label>
              {skillsStatus === 'loading' ? (
                <p className="mt-1 text-sm text-gray-500">Loading skills...</p>
              ) : Array.isArray(availableSkills) && availableSkills.length > 0 ? (
                <Select
                  isMulti
                  name="skills"
                  options={availableSkills.map((skill) => ({ value: skill, label: skill }))}
                  value={formData.skills.map((skill) => ({ value: skill, label: skill }))}
                  onChange={handleSkillsChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select skills..."
                  isDisabled={skillsStatus !== 'succeeded'}
                  aria-invalid={!!errors.skills}
                  aria-describedby={errors.skills ? 'skills-error' : undefined}
                  aria-required="true"
                />
              ) : (
                <p className="mt-1 text-sm text-red-500">No skills available. Please contact support.</p>
              )}
              {errors.skills && (
                <p id="skills-error" className="mt-1 text-sm text-red-500">
                  {errors.skills}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary (INR)
                </label>
                <input
                  id="salary"
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., 50000"
                  aria-required="false"
                />
                {errors.salary && (
                  <p id="salary-error" className="mt-1 text-sm text-red-500">
                    {errors.salary}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.type}
                  aria-describedby={errors.type ? 'type-error' : undefined}
                  aria-required="true"
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Onsite">Onsite</option>
                </select>
                {errors.type && (
                  <p id="type-error" className="mt-1 text-sm text-red-500">
                    {errors.type}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  id="experience"
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., 2-5 years"
                  aria-required="false"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  id="deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm ${
                    errors.deadline ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.deadline}
                  aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                  aria-required="true"
                />
                {errors.deadline && (
                  <p id="deadline-error" className="mt-1 text-sm text-red-500">
                    {errors.deadline}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  aria-required="false"
                />
              </div>
              <div>
                <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700 mb-1">
                  Vacancies
                </label>
                <input
                  id="vacancies"
                  type="number"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., 3"
                  aria-required="false"
                />
                {errors.vacancies && (
                  <p id="vacancies-error" className="mt-1 text-sm text-red-500">
                    {errors.vacancies}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  id="contactPerson"
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., John Doe, HR Manager"
                  aria-required="false"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="e.g., Frontend Developer"
                  aria-required="false"
                />
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                aria-required="false"
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
              onClick={() => navigate('/joblistings')}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all focus:ring-2 focus:ring-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={jobsStatus === 'loading' || skillsStatus === 'loading'}
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