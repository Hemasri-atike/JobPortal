import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarLoader } from 'react-spinners';
import { applyToJobThunk, clearApplyState, fetchJobs, fetchUserApplications } from '../../store/jobsSlice.js';

const Application = ({ job, onClose }) => {
  const dispatch = useDispatch();
  const { loadingApply, errorApply, successApply } = useSelector((state) => state.jobs || {});
  const user = useSelector((state) => state.auth?.user || { id: 'user123', name: 'John Doe' });

  const [formData, setFormData] = useState({
    name: user.name || '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    jobTitle: job?.title || '',
    company: job?.company_name || '',
    qualification: '',
    specialization: '',
    university: '',
    skills: '',
    coverLetter: '',
    linkedIn: '',
    portfolio: '',
    job_id: job?.id?.toString() || '', // Ensure string
    candidate_id: user.id || 'user123',
    status: 'applied',
  });
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (successApply) {
      dispatch(clearApplyState());
      dispatch(fetchJobs({
        statusFilter: 'all',
        searchQuery: '',
        location: '',
        page: 1,
        jobsPerPage: 5,
      }));
      dispatch(fetchUserApplications(user.id)); // Refresh applied jobs
      onClose();
    }
  }, [successApply, dispatch, onClose, user.id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.job_id) newErrors.job_id = 'Invalid job ID';
    if (!formData.candidate_id) newErrors.candidate_id = 'User ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, resume: 'File size exceeds 5MB limit' });
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErrors({ ...errors, resume: 'Invalid file format. Use PDF or Word.' });
        return;
      }
    }
    setResume(file);
    setErrors({ ...errors, resume: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      console.error('Validation failed:', errors);
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (resume) data.append('resume', resume);

      // Log FormData for debugging
      for (const [key, value] of data.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      await dispatch(applyToJobThunk(data)).unwrap();
    } catch (error) {
      console.error('Application submission failed:', error, error?.payload, error?.meta);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Job Application Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-600">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <p id="name-error" className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <p id="email-error" className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-600">Professional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="experience" className="block text-sm font-medium mb-1">Experience (Years)</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                className="w-full border p-2 rounded-lg bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                className="w-full border p-2 rounded-lg bg-gray-100"
                readOnly
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-600">Education Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="qualification" className="block text-sm font-medium mb-1">Qualification</label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium mb-1">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="university" className="block text-sm font-medium mb-1">University</label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-600">Skills & Resume</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium mb-1">Skills</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Java, React, SQL"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="resume" className="block text-sm font-medium mb-1">Resume</label>
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className={`w-full border p-2 rounded-lg ${errors.resume ? 'border-red-500' : ''}`}
                aria-invalid={!!errors.resume}
                aria-describedby={errors.resume ? 'resume-error' : undefined}
              />
              {errors.resume && <p id="resume-error" className="text-red-500 text-sm">{errors.resume}</p>}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-600">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="linkedIn" className="block text-sm font-medium mb-1">LinkedIn</label>
              <input
                type="url"
                id="linkedIn"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                placeholder="LinkedIn Profile URL"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium mb-1">Portfolio/GitHub</label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="Portfolio or GitHub URL"
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">Cover Letter</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows="4"
              placeholder="Write a short cover letter..."
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loadingApply && (
          <div className="text-center">
            <BarLoader width="100%" color="#36d7b7" />
          </div>
        )}
        {errorApply && <p className="text-red-500 text-center">{errorApply}</p>}
        {errors.job_id && <p className="text-red-500 text-center">{errors.job_id}</p>}
        {errors.candidate_id && <p className="text-red-500 text-center">{errors.candidate_id}</p>}

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loadingApply}
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default Application;