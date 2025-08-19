
import { User, Briefcase, BookOpen, Code, FileText } from 'lucide-react';

// Custom Button component to match JobSearch
const Button = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const ApplicationCard = ({ application }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center">
            <User size={14} className="mr-1" /> {application.name || 'Unknown Candidate'}
          </h4>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              application.status === 'applied'
                ? 'bg-yellow-100 text-yellow-800'
                : application.status === 'accepted'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>
        <div className="text-sm text-gray-600 flex items-center">
          <Briefcase size={14} className="mr-1" /> Experience: {application.experience || 0} years
        </div>
        <div className="text-sm text-gray-600 flex items-center">
          <BookOpen size={14} className="mr-1" /> Education: {application.education || 'N/A'}
        </div>
        {application.skills && (
          <div className="text-sm text-gray-600 flex items-center">
            <Code size={14} className="mr-1" /> Skills:{' '}
            {application.skills.split(',').map((skill) => (
              <span key={skill} className="ml-1 px-2 py-1 bg-gray-100 rounded-md text-xs">
                {skill.trim()}
              </span>
            ))}
          </div>
        )}
        {application.resume && (
          <div className="text-sm text-gray-600 flex items-center">
            <FileText size={14} className="mr-1" /> Resume:{' '}
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:underline"
            >
              View Resume
            </a>
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <Button
            className="bg-green-600 hover:bg-green-700 text-xs py-1 px-3"
            onClick={() => console.log('Accept application', application.id)}
          >
            Accept
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-xs py-1 px-3"
            onClick={() => console.log('Reject application', application.id)}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;