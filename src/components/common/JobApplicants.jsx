// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchApplicantsByJob } from "../../store/jobsSlice";

// const JobApplicants = ({ jobId }) => {
//   const dispatch = useDispatch();

//   // Select data from Redux
//   const applicants = useSelector(
//     (state) => state.jobs.applicants[jobId] || []
//   );
//   const applicantsStatus = useSelector((state) => state.jobs.applicantsStatus);
//   const applicantsError = useSelector((state) => state.jobs.applicantsError);

//   // Fetch applicants when component mounts
//   useEffect(() => {
//     if (jobId) {
//       dispatch(fetchApplicantsByJob({ jobId }));
//     }
//   }, [dispatch, jobId]);

//   if (applicantsStatus === "loading") return <p>Loading applicants...</p>;
//   if (applicantsStatus === "failed") return <p>Error: {applicantsError}</p>;

//   return (
//     <div>
//       <h2>Applicants for Job #{jobId}</h2>
//       {applicants.length === 0 ? (
//         <p>No applicants yet</p>
//       ) : (
//         <ul>
//           {applicants.map((app) => (
//             <li key={app.id}>
//               <strong>{app.fullName}</strong> - {app.email} ({app.status})
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default JobApplicants;
