import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import statesWithCities from '../common/Statesncities.jsx';

import { 
  createJob, 
  updateJob, 
  deleteJob, 
  clearUpdateJobState, 
  clearDeleteJobState, 
  clearAddJobState     
} from '../../store/jobsSlice.js';

import { fetchCategories, fetchSubcategories, fetchSkills } from '../../store/categoriesSlice.js';
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
    skills = [],
    skillsStatus = 'idle',
    error: categoriesError = null,
    skillsError = null,
  } = useSelector((state) => state.categories || {});

  const {
    jobsStatus = 'idle',
    jobsError = null,
    updateJobError = null,
    updateJobSuccess = false,
    addJobError = null,
    addJobSuccess = false,
    deleteJobError = null,
    deleteJobSuccess = false,
  } = useSelector((state) => state.jobs || {});
  const { userInfo = null, userType = null } = useSelector((state) => state.user || {});

  const stateOptions = Object.keys(statesWithCities).sort();

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    about_company: '',
    education_required: '',
    required_skills_text: '',
    state: '',
    city: '',
    location: '',
    description: '',
    category_name: '',
    subcategory_name: '',
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
  
  const [isDeleting, setIsDeleting] = useState(false);

  const cityOptions = formData.state ? (statesWithCities[formData.state] || []).sort() : [];

  useEffect(() => {
    if (skillsStatus === 'idle') {
      dispatch(fetchSkills());
    }
  }, [dispatch, skillsStatus]);

  // Check authentication and fetch categories
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

  // Fetch subcategories when category_name changes
  useEffect(() => {
    if (formData.category_name) {
      dispatch(fetchSubcategories(formData.category_name));
    } else {
      dispatch({ type: 'categories/resetSubcategories' });
    }
  }, [formData.category_name, dispatch]);

  // Populate form for editing
  useEffect(() => {
    if (id && job && skillsStatus === 'succeeded' && skills.length > 0) {
      const category = categories.find((cat) => cat.id === job.category_id);
      const subcategory = subcategories.find((sub) => sub.id === job.subcategory_id);
      const validSkills = Array.isArray(job.skills)
        ? job.skills.filter((skill) => skills.includes(skill))
        : [];
      console.log('Initializing formData for job:', {
        jobId: job.id,
        jobSkills: job.skills,
        skills,
        validSkills,
      });
      setFormData({
        title: job.title || '',
        company_name: job.company_name || '',
        about_company: job.about_company || '',
        education_required: job.education_required || '',
        required_skills_text: job.required_skills_text || '',
        state: job.state || '',
        city: job.city || '',
        location: job.location || '',
        description: job.description || '',
        category_name: category ? category.name : '',
        subcategory_name: subcategory ? subcategory.name : '',
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
      if (category && !subcategories.length && category.name) {
        dispatch(fetchSubcategories(category.name));
      }
    }
  }, [id, job, categories, subcategories, dispatch, skills, skillsStatus]);

  // Handle success and error states
  useEffect(() => {
    if (updateJobSuccess) {
      toast.success('Job updated successfully.', { position: 'top-right', autoClose: 3000 });
      dispatch(clearUpdateJobState());
      navigate('/joblistings');
    }
    if (updateJobError) {
      const errorMessage = updateJobError.message || updateJobError.data?.error || 'Failed to update job.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
      dispatch(clearUpdateJobState());
    }
    if (addJobSuccess) {
      toast.success('Successfully posted a job.', { position: 'top-right', autoClose: 3000 });
      setFormData({
        title: '',
        company_name: '',
        about_company: '',
        education_required: '',
        required_skills_text: '',
        state: '',
        city: '',
        location: '',
        description: '',
        category_name: '',
        subcategory_name: '',
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
      setErrors({});
      dispatch(clearAddJobState());
      navigate('/joblistings');
    }
    if (addJobError) {
      const errorMessage = addJobError.message || addJobError.data?.error || 'Failed to create job.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
      dispatch(clearAddJobState());
    }
    if (deleteJobSuccess) {
      toast.success('Job deleted successfully.', { position: 'top-right', autoClose: 3000 });
      dispatch(clearDeleteJobState());
      navigate('/joblistings');
    }
    if (deleteJobError) {
      const errorMessage = deleteJobError.message || deleteJobError.data?.error || 'Failed to delete job.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
      dispatch(clearDeleteJobState());
      setIsDeleting(false);
    }
  }, [
    updateJobSuccess,
    updateJobError,
    addJobSuccess,
    addJobError,
    deleteJobSuccess,
    deleteJobError,
    dispatch,
    navigate,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'category_name') updated.subcategory_name = ''; 
      return updated;
    });
    setErrors(prev => {
      const updatedErrors = { ...prev, [name]: '' };
      if (name === 'category_name') updatedErrors.subcategory_name = '';
      return updatedErrors;
    });
  };

  // Handle skills change
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
    if (!formData.category_name) newErrors.category_name = 'Category is required';
    if (!formData.subcategory_name && formData.category_name && subcategories.length > 0)
      newErrors.subcategory_name = 'Subcategory is required';
    if (!formData.type) newErrors.type = 'Job Type is required';
    if (!formData.deadline) newErrors.deadline = 'Application Deadline is required';
    if (formData.deadline && formData.deadline < today)
      newErrors.deadline = 'Deadline must be a future date';
    if (formData.salary < 0) newErrors.salary = 'Salary cannot be negative';
    if (!formData.about_company) newErrors.about_company = 'About Company is required';
    if (!formData.education_required) newErrors.education_required = 'Education details are required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
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
      const payload = {
        ...formData,
        category_name: formData.category_name,
        subcategory_name: formData.subcategory_name,
      };

      console.log('Submitting payload:', { id, ...payload });
      if (id) {
        await dispatch(updateJob({ id, ...payload })).unwrap();
      } else {
        await dispatch(createJob(payload)).unwrap();
      }
    } catch (err) {
      const errorMessage = err.message?.includes('network')
        ? 'Network error. Please check your connection.'
        : err.message || `Failed to ${id ? 'update' : 'create'} job.`;
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
    }
  };

  // Handle job deletion
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      await dispatch(deleteJob(id)).unwrap();
    } catch (err) {
      setIsDeleting(false);
      const errorMessage = err.message || 'Failed to delete job.';
      toast.error(errorMessage, { position: 'top-right', autoClose: 5000 });
    }
  };

  // Category change handler
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      category_name: value,
      subcategory_name: ''
    }));
    setErrors(prev => ({ ...prev, category_name: '', subcategory_name: '' }));
  };

  // Subcategory change handler
  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      subcategory_name: value
    }));
    setErrors(prev => ({ ...prev, subcategory_name: '' }));
  };

  // State change handler
  const handleStateChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      state: value,
      city: ''
    }));
    setErrors(prev => ({ ...prev, state: '', city: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {id ? 'Edit Job Posting' : 'Create a New Job Posting'}
          </h1>
          {id && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || jobsStatus === 'loading'}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all focus:ring-2 focus:ring-red-400 focus:outline-none disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete Job'}
            </button>
          )}
        </div>

        {(jobsStatus === 'failed' || categoriesStatus === 'failed' || skillsStatus === 'failed') && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            {jobsError || categoriesError || 'An error occurred while processing your request.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" disabled={jobsStatus === 'loading'}>
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
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
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
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
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
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Company & Education Details</h2>
              
              <div>
                <label htmlFor="about_company" className="block text-sm font-medium text-gray-700 mb-1">
                  About Company <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="about_company"
                  name="about_company"
                  value={formData.about_company}
                  onChange={handleChange}
                  rows="4"
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.about_company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Write a brief about the company culture, mission, and values..."
                  aria-invalid={!!errors.about_company}
                  aria-describedby={errors.about_company ? 'about_company-error' : undefined}
                  aria-required="true"
                />
                {errors.about_company && (
                  <p id="about_company-error" className="mt-1 text-sm text-red-500">
                    {errors.about_company}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="education_required" className="block text-sm font-medium text-gray-700 mb-1">
                  Education Required <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="education_required"
                  name="education_required"
                  value={formData.education_required}
                  onChange={handleChange}
                  rows="3"
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.education_required ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., B.Tech in Computer Science, MBA, etc."
                  aria-invalid={!!errors.education_required}
                  aria-describedby={errors.education_required ? 'education_required-error' : undefined}
                  aria-required="true"
                />
                {errors.education_required && (
                  <p id="education_required-error" className="mt-1 text-sm text-red-500">
                    {errors.education_required}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="required_skills_text" className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills (Description)
                </label>
                <textarea
                  id="required_skills_text"
                  name="required_skills_text"
                  value={formData.required_skills_text}
                  onChange={handleChange}
                  rows="3"
                  disabled={jobsStatus === 'loading'}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
                  placeholder="Describe required skills beyond the checklist above..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
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
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.state}
                  aria-describedby={errors.state ? 'state-error' : undefined}
                  aria-required="true"
                >
                  <option value="">Select State</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p id="state-error" className="mt-1 text-sm text-red-500">
                    {errors.state}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!formData.state || jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                  aria-required="true"
                >
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p id="city-error" className="mt-1 text-sm text-red-500">
                    {errors.city}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleCategoryChange}
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.category_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.category_name}
                  aria-describedby={errors.category_name ? 'category_name-error' : undefined}
                  aria-required="true"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {categoriesStatus === 'loading' && (
                  <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
                )}
                {errors.category_name && (
                  <p id="category_name-error" className="mt-1 text-sm text-red-500">
                    {errors.category_name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="subcategory_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  id="subcategory_name"
                  name="subcategory_name"
                  value={formData.subcategory_name}
                  onChange={handleSubcategoryChange}
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
                    errors.subcategory_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={!!errors.subcategory_name}
                  aria-describedby={errors.subcategory_name ? 'subcategory_name-error' : undefined}
                  aria-required="true"
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
                {subcategoriesStatus === 'loading' && (
                  <p className="mt-1 text-sm text-gray-500">Loading subcategories...</p>
                )}
                {errors.subcategory_name && (
                  <p id="subcategory_name-error" className="mt-1 text-sm text-red-500">
                    {errors.subcategory_name}
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
                disabled={jobsStatus === 'loading'}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
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
              ) : Array.isArray(skills) && skills.length > 0 ? (
                <Select
                  isMulti
                  name="skills"
                  options={skills.map((skill) => ({ value: skill, label: skill }))}
                  value={formData.skills.map((skill) => ({ value: skill, label: skill }))}
                  onChange={handleSkillsChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select skills..."
                  isDisabled={skillsStatus !== 'succeeded' || jobsStatus === 'loading'}
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
                  disabled={jobsStatus === 'loading'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
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
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
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
                  disabled={jobsStatus === 'loading'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
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
                  disabled={jobsStatus === 'loading'}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100 ${
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
                  disabled={jobsStatus === 'loading'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
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
                  disabled={jobsStatus === 'loading'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
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
                  disabled={jobsStatus === 'loading'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
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
                  disabled={jobsStatus === 'loading'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
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
                disabled={jobsStatus === 'loading'}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm disabled:bg-gray-100"
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
              disabled={jobsStatus === 'loading' || isDeleting}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all focus:ring-2 focus:ring-gray-400 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={jobsStatus === 'loading' || skillsStatus === 'loading' || isDeleting}
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