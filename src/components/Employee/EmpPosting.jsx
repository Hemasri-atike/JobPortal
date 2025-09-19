import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createJob, updateJob, fetchCategories } from '../../store/jobsSlice.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmpPosting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const job = state?.job;
  const { categories, categoriesStatus, jobsStatus, jobsError } = useSelector((state) => state.jobs || {});
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
    status: 'Draft',
    contactPerson: '',
    role: '',
    startDate: '',
    vacancies: '',
  });

  useEffect(() => {
    if (!userInfo || !userType || (userType !== 'employer' && userType !== 'admin')) {
      toast.error('Unauthorized access.');
      navigate('/login');
      return;
    }
    dispatch(fetchCategories());
  }, [dispatch, userInfo, userType, navigate]);

  useEffect(() => {
    if (id && job) {
      console.log('Populating form with job:', job);
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
        status: job.status || 'Draft',
        contactPerson: job.contactPerson || '',
        role: job.role || '',
        startDate: job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : '',
        vacancies: job.vacancies || '',
      });
    }
  }, [id, job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim()).filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.company_name || !formData.location || !formData.description) {
        toast.error('Please fill in all required fields.');
        return;
      }
      console.log('Submitting job:', { id, ...formData });
      if (id) {
        await dispatch(updateJob({ id, ...formData })).unwrap();
        toast.success('Job updated successfully.');
      } else {
        await dispatch(createJob({ ...formData, userId: userInfo.id })).unwrap();
        toast.success('Job created successfully.');
      }
      navigate('/joblisting');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err?.message || `Failed to ${id ? 'update' : 'create'} job.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">{id ? 'Edit Job' : 'Post a New Job'}</h1>
        {jobsStatus === 'failed' && (
          <p className="text-red-600 mt-4">{jobsError || 'An error occurred.'}</p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={categoriesStatus === 'loading' || categories.length === 0}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Job Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700">Vacancies</label>
            <input
              type="number"
              name="vacancies"
              value={formData.vacancies}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/joblisting')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={jobsStatus === 'loading'}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {id ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default EmpPosting;