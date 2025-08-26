const JobCard = ({ job }) => {
  if (!job) return null; // Skip rendering if job is undefined

  const {
    id,
    title = "Untitled Job",
    company_name = "Unknown Company",
    location = "Location not specified",
    tags = [],
    description = "No description available",
  } = job;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{company_name}</p>
      <p className="text-sm text-gray-400">{location}</p>

      {tags.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {tags.map((tag, i) => (
            <span
              key={`${id}-${tag}-${i}`} // Unique key combining job id and index
              className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 text-gray-600">{description}</p>
      <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
