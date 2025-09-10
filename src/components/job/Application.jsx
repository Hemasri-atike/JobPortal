import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarLoader } from 'react-spinners';
import { applyForJob } from '../../store/jobsSlice.js';

const Application = ({ job, onClose }) => {
  const dispatch = useDispatch();
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

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'resume'];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill out required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number.');
      return;
    }

    // Validate file types and size (max 5MB)
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

    setIsSubmitting(true);
    try {
      const submissionData = new FormData();
      submissionData.append('jobId', job.id);
      submissionData.append('candidateId', userInfo?.id || '');
      Object.keys(formData).forEach((key) => {
        if (formData[key] && key !== 'resume' && key !== 'coverLetter') {
          submissionData.append(key, formData[key]);
        }
      });
      if (formData.resume) submissionData.append('resume', formData.resume);
      if (formData.coverLetter) submissionData.append('coverLetter', formData.coverLetter);

      await dispatch(applyForJob(submissionData)).unwrap();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
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
            {error.includes('job_id') && (
              <p className="mt-2">
                Please ensure you are applying for a valid job.{' '}
                <a
                  href="/jobs"
                  className="text-blue-600 hover:underline"
                  aria-label="Go to jobs page"
                >
                  Browse jobs
                </a>
              </p>
            )}
            {error.includes('File') && (
              <p className="mt-2">
                Please ensure uploaded files are valid (.pdf, .doc, .docx, max 5MB).
              </p>
            )}
          </div>
        )}

        {/* Personal Information */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            />
          </div>
        </div>

        {/* Work Experience */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Experience</h3>
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Years of Experience
            </label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
              min="0"
            />
          </div>
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current/Last Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current/Last Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            />
          </div>
        </div>

        {/* Education */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Education</h3>
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <label
              htmlFor="qualification"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Highest Qualification
            </label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            />
          </div>
          <div>
            <label
              htmlFor="specialization"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Specialization
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="university"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              University
            </label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            />
          </div>
        </div>

        {/* Skills and Documents */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills and Documents</h3>
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Skills (comma-separated)
            </label>
            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
              rows="3"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Resume <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
              required
              aria-required="true"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="coverLetter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cover Letter (Optional)
            </label>
            <input
              type="file"
              id="coverLetter"
              name="coverLetter"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="linkedIn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              LinkedIn Profile (Optional)
            </label>
            <input
              type="url"
              id="linkedIn"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="portfolio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Portfolio (Optional)
            </label>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Cancel application"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
            aria-label="Submit application"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <BarLoader
                  width={20}
                  height={4}
                  color="#fff"
                  className="mr-2"
                  aria-hidden="true"
                />
                Submitting...
              </div>
            ) : (
              'Apply Now'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Application;