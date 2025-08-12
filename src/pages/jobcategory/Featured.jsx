
import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import JobCard from '../../components/ui/JobCard';

const Featured = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  // Simulate API load
  useEffect(() => {
    setTimeout(() => {
      const mockJobs = [
        {
          id: '1',
          title: 'Frontend Developer',
          company: 'TechCorp',
          location: 'Bangalore',
          skills: ['React', 'Tailwind', 'JavaScript'],
          description: 'Work on cutting-edge UI features with React and Tailwind CSS.',
        },
        {
          id: '2',
          title: 'Backend Developer',
          company: 'DataWorks',
          location: 'Mumbai',
          skills: ['Node.js', 'Express', 'MongoDB'],
          description: 'Build and maintain APIs with Node.js, Express, and MongoDB.',
        },
      ];
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-8 text-center">
        Featured Jobs
      </h2>

      {loading ? (
        <BarLoader className="mt-4 mx-auto" width="100%" color="#36d7b7" />
      ) : (
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length ? (
            jobs.map((job) => <JobCard key={job.id} job={job} savedInit={false} />)
          ) : (
            <div className="text-center text-gray-600 col-span-full">No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Featured;