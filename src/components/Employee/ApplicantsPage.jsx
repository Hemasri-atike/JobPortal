import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicantsByJob } from "../../store/jobsSlice"

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const applicants = useSelector((state) => state.jobs.applicants[jobId] || []);
  const status = useSelector((state) => state.jobs.applicantsStatus);
  const error = useSelector((state) => state.jobs.applicantsError);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchApplicantsByJob({ jobId }));
    }
  }, [dispatch, jobId]);

  if (status === 'loading') return <p>Loading applicants...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;
  if (applicants.length === 0) return <p>No applicants found for this job.</p>;

  return (
    <div>
      <h2>Applicants for Job #{jobId}</h2>
      <ul>
        {applicants.map((app) => (
          <li key={app.id}>
            <p><strong>Name:</strong> {app.fullName}</p>
            <p><strong>Email:</strong> {app.email}</p>
            <p><strong>Phone:</strong> {app.phone}</p>
            <p><strong>Status:</strong> {app.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicantsPage;
