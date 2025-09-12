// In src/components/Application.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { applyForJob } from '../../store/jobsSlice';
import { toast } from 'react-toastify';

const Application = ({ job, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user || {});
  const [formData, setFormData] = useState({
    fullName: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: '',
    location: '',
    experience: '',
    jobTitle: '',
    company: '',
    qualification: '',
    specialization: '',
    university: '',
    skills: '',
    resume: null,
    coverLetter: null,
    linkedIn: '',
    portfolio: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!job?.id) {
      setError('Invalid job ID. Please select a valid job.');
      console.error('Invalid job ID in Application:', job);
      return;
    }

    const requiredFields = ['fullName', 'email', 'phone', 'resume'];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill out required fields: ${missingFields.join(', ')}`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (
      formData.resume &&
      !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
        formData.resume.type
      )
    ) {
      setError('Resume must be a .pdf, .doc, or .docx file.');
      return;
    }
    if (formData.resume && formData.resume.size > 5 * 1024 * 1024) {
      setError('Resume file size must be less than 5MB.');
      return;
    }

    if (
      formData.coverLetter &&
      !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
        formData.coverLetter.type
      )
    ) {
      setError('Cover letter must be a .pdf, .doc, or .docx file.');
      return;
    }
    if (formData.coverLetter && formData.coverLetter.size > 5 * 1024 * 1024) {
      setError('Cover letter file size must be less than 5MB.');
      return;
    }

    // Removed authorization check - no longer requiring login

    setIsSubmitting(true);
    try {
      const submissionData = {
        jobId: job.id,
        // Removed candidate_id since no auth
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        experience: formData.experience,
        jobTitle: formData.jobTitle,
        company: formData.company,
        qualification: formData.qualification,
        specialization: formData.specialization,
        university: formData.university,
        skills: formData.skills,
        resume: formData.resume,
        coverLetter: formData.coverLetter,
        linkedIn: formData.linkedIn,
        portfolio: formData.portfolio,
      };

      console.log('Submitting application:', submissionData);
      const response = await dispatch(applyForJob(submissionData)).unwrap();
      console.log('Application submitted successfully:', response);
      toast.success('Application submitted successfully!');
      onClose();
      navigate('/applied'); // Redirect to Applied page
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Failed to submit application. Please try again.';
      console.error('Application submission error:', err, {
        message: err.message,
        stack: err.stack,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(errorMessage);
      // Removed auth-specific redirects
      if (errorMessage.includes('inactive') || errorMessage.includes('already applied')) {
        setTimeout(() => navigate('/jobs'), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {error && (
          <div
            className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm"
            role="alert"
            aria-live="assertive"
          >
            {error}
            {error.includes('Invalid job ID') || error.includes('Job not found') ? (
              <p className="mt-2">
                Please ensure you are applying for a valid job.{' '}
                <a href="/jobs" className="text-blue-600 hover:underline">
                  Browse jobs
                </a>
              </p>
            ) : error.includes('file') || error.includes('resume') || error.includes('coverLetter') ? (
              <p className="mt-2">
                Please ensure uploaded files are valid (.pdf, .doc, .docx, max 5MB).
              </p>
            ) : error.includes('already applied') ? (
              <p className="mt-2">
                You have already applied to this job.{' '}
                <a href="/jobs" className="text-blue-600 hover:underline">
                  Browse other jobs
                </a>
              </p>
            ) : error.includes('inactive') ? (
              <p className="mt-2">
                This job is no longer accepting applications.{' '}
                <a href="/jobs" className="text-blue-600 hover:underline">
                  Browse other jobs
                </a>
              </p>
            ) : null}
          </div>
        )}
        {isSubmitting && (
          <div className="mb-4">
            <BarLoader width="100%" color="#2563EB" />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Experience (Years)
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
              Current/Last Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Current/Last Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
              Highest Qualification
            </label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
              Specialization
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-700">
              University
            </label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
              Resume <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
              Cover Letter
            </label>
            <input
              type="file"
              id="coverLetter"
              name="coverLetter"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700">
              LinkedIn Profile
            </label>
            <input
              type="url"
              id="linkedIn"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
              Portfolio
            </label>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mt-6 flex justify-end gap-4 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Cancel application"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
              aria-label="Submit application"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Application;