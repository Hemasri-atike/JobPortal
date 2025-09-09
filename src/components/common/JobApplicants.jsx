// src/components/JobApplicants.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchApplicantsByJob, clearApplicantsState } from '../../store/jobsSlice.js';

const JobApplicants = () => {
 const { jobId } = useParams();
 const dispatch = useDispatch();
 const { userInfo, userType } = useSelector((state) => state.user);
 const { applicants, jobsStatus, jobsError } = useSelector((state) => state.jobs);

 console.log('JobApplicants: jobId=', jobId, 'userInfo=', userInfo, 'userType=', userType, 'jobsStatus=', jobsStatus, 'jobsError=', jobsError);

 useEffect(() => {
 if (userType === 'employer' && jobId && jobsStatus !== 'loading') {
 console.log('Dispatching fetchApplicantsByJob for jobId:', jobId);
 dispatch(fetchApplicantsByJob(Number(jobId)));
 }
 }, [jobId, userType, dispatch]);

 useEffect(() => {
 return () => {
 console.log('JobApplicants cleanup: Clearing applicants state');
 dispatch(clearApplicantsState());
 };
 }, [dispatch]);

 if (jobsStatus === 'loading') {
 return <div>Loading applicants...</div>;
 }

 if (jobsStatus === 'failed') {
 return <div>Error: {jobsError || 'Failed to fetch applicants'}</div>;
 }

 if (!applicants[jobId] || applicants[jobId].length === 0) {
 return <div>No applicants found for job ID {jobId}</div>;
 }

 return (
 <div>
 <h2>Applicants for Job ID {jobId}</h2>
 <ul>
 {applicants[jobId].map((applicant) => (
 <li key={applicant.id}>
 {applicant.name} ({applicant.email}) - {applicant.status}
 </li>
 ))}
 </ul>
 </div>
 );
};

export default JobApplicants;