// Sidebar / Filters


import statesWithCities from "../common/Statesncities";
const FilterSection = ({
  filters,
  setFilters,
  companies,
  citySearch,
  setCitySearch,
  showCityDropdown,
  setShowCityDropdown,
  handleCitySelect,
  dispatch
}) => {

  const toggleCheckbox = (filterKey, value) => {
    const current = Array.isArray(filters[filterKey]) ? filters[filterKey] : [];
    if (current.includes(value)) {
      setFilters({ ...filters, [filterKey]: current.filter((v) => v !== value) });
    } else {
      setFilters({ ...filters, [filterKey]: [...current, value] });
    }
  };

  const jobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Work From Home"];
  const workModes = ["Remote", "On-site", "Hybrid"];
  const skillsList = ["React", "Node.js", "JavaScript", "Python", "Java", "SQL"];

  return (
    <>
      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-700">State</label>
        <select
          value={filters.state}
          onChange={(e) => {
            setFilters({ ...filters, state: e.target.value, city: "" });
            setCitySearch("");
            setShowCityDropdown(false);
          }}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select State</option>
          {Object.keys(statesWithCities).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          value={citySearch}
          onFocus={() => setShowCityDropdown(true)}
          onChange={(e) => {
            setCitySearch(e.target.value);
            setShowCityDropdown(true);
          }}
          disabled={!filters.state}
          placeholder={!filters.state ? "Select state first" : "Search city..."}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
        />
        {filters.state && showCityDropdown && (
          <ul className="absolute z-50 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto rounded-md shadow-lg">
            {statesWithCities[filters.state]
              .filter((city) => city.toLowerCase().includes(citySearch.toLowerCase()))
              .map((city) => (
                <li
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                >
                  {city}
                </li>
              ))}
            {statesWithCities[filters.state].filter((city) =>
              city.toLowerCase().includes(citySearch.toLowerCase())
            ).length === 0 && (
              <li className="px-3 py-2 text-gray-500 text-sm">No cities found</li>
            )}
          </ul>
        )}
      </div>

      {/* Job Type Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Job Type</label>
        <div className="mt-1 space-y-1">
          {jobTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.jobType?.includes(type)}
                onChange={() => toggleCheckbox("jobType", type)}
                className="h-4 w-4 border-gray-300 rounded"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Mode Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Work Mode</label>
        <div className="mt-1 space-y-1">
          {workModes.map((mode) => (
            <label key={mode} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.workMode?.includes(mode)}
                onChange={() => toggleCheckbox("workMode", mode)}
                className="h-4 w-4 border-gray-300 rounded"
              />
              <span>{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills Checkboxes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Skills</label>
        <div className="mt-1 space-y-1 max-h-36 overflow-y-auto">
          {skillsList.map((skill) => (
            <label key={skill} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.skills?.includes(skill)}
                onChange={() => toggleCheckbox("skills", skill)}
                className="h-4 w-4 border-gray-300 rounded"
              />
              <span>{skill}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
};
export default FilterSection;