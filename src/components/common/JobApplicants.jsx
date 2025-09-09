import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApplicantsByJob, clearApplicantsState } from '../../store/jobsSlice';

const JobApplicants = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, userType } = useSelector((state) => state.user);
  const { applicants, jobsStatus, jobsError } = useSelector((state) => state.jobs);

  console.log('JobApplicants: jobId=', jobId, 'userInfo=', userInfo, 'userType=', userType, 'jobsStatus=', jobsStatus, 'jobsError=', jobsError, 'applicants=', applicants);

  // Memoize fetch function
  const fetchApplicants = useCallback(() => {
    console.log('fetchApplicants called with jobsStatus=', jobsStatus);
    if (jobsStatus !== 'loading' && jobsStatus !== 'succeeded') {
      console.log('Dispatching fetchApplicantsByJob for jobId:', jobId);
      dispatch(fetchApplicantsByJob(Number(jobId)));
    }
  }, [jobId, jobsStatus, dispatch]);

  useEffect(() => {
    // Validate jobId and userType
    if (!jobId || isNaN(Number(jobId))) {
      console.error('JobApplicants: Invalid jobId:', jobId);
      navigate('/jobs/:jobId/applicants', { state: { error: 'Invalid job ID' } });
      return;
    }
    if (userType !== 'employer') {
      console.error('JobApplicants: Unauthorized access, userType=', userType);
      navigate('/jobs/:jobId/applicants', { state: { error: 'Unauthorized access' } });
      return;
    }
    fetchApplicants();
  }, [jobId, userType, dispatch, navigate, fetchApplicants]);

  useEffect(() => {
    return () => {
      console.log('JobApplicants cleanup: Clearing applicants state');
      dispatch(clearApplicantsState());
    };
  }, [dispatch]);

  if (!jobId || isNaN(Number(jobId))) {
    return <div>Error: Invalid job ID</div>;
  }

  if (jobsStatus === 'loading') {
    return <div>Loading applicants...</div>;
  }

  if (jobsStatus === 'failed') {
    return (
      <div>
        <p>Error: {jobsError || 'Failed to fetch applicants'}</p>
        <button
          onClick={fetchApplicants}
          disabled={jobsStatus === 'loading'}
        >
          Retry
        </button>
      </div>
    );
  }

  const jobApplicants = applicants[jobId] || [];

  return (
    <div>
      <h2>Applicants for Job ID {jobId}</h2>
      {jobApplicants.length > 0 ? (
        <ul>
          {jobApplicants.map((applicant) => (
            <li key={applicant.id}>
              <strong>{applicant.name}</strong> ({applicant.email}) - Status: {applicant.status}
              {applicant.phone && <p>Phone: {applicant.phone}</p>}
              {applicant.location && <p>Location: {applicant.location}</p>}
              {applicant.experience && <p>Experience: {applicant.experience}</p>}
              {applicant.jobTitle && <p>Job Title: {applicant.jobTitle}</p>}
              {applicant.company && <p>Company: {applicant.company}</p>}
              {applicant.qualification && <p>Qualification: {applicant.qualification}</p>}
              {applicant.specialization && <p>Specialization: {applicant.specialization}</p>}
              {applicant.university && <p>University: {applicant.university}</p>}
              {applicant.skills && <p>Skills: {applicant.skills}</p>}
              {applicant.resume && (
                <p>
                  Resume: <a href={applicant.resume} target="_blank" rel="noopener noreferrer">Download</a>
                </p>
              )}
              {applicant.coverLetter && <p>Cover Letter: {applicant.coverLetter}</p>}
              {applicant.linkedIn && (
                <p>
                  LinkedIn: <a href={applicant.linkedIn} target="_blank" rel="noopener noreferrer">Profile</a>
                </p>
              )}
              {applicant.portfolio && (
                <p>
                  Portfolio: <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer">View</a>
                </p>
              )}
              {applicant.applied_at && <p>Applied At: {new Date(applicant.applied_at).toLocaleString()}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No applicants found for job ID {jobId}. Check back later or promote this job to attract candidates.</p>
      )}
    </div>
  );
};

export default JobApplicants;