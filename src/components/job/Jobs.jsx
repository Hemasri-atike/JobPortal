import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobsByCategoryOrSubcategory } from '../../store/jobsSlice';
import { fetchCategories, fetchSkills, fetchSubcategories } from '../../store/categoriesSlice';
import JobCard from '../../components/ui/JobCard';

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Parse initial filters from URL
  const queryParams = new URLSearchParams(location.search);
  const initialFilters = {
    category: queryParams.get('category') || '',
    subcategory: queryParams.get('subcategory') || '',
    role: queryParams.get('role') || '',
    skills: queryParams.get('skills') ? queryParams.get('skills').split(',') : [],
  };

  const [filters, setFilters] = useState(initialFilters);

  // Redux state
  const {
    categories = [],
    categoriesStatus,
    subcategories = [],
    subcategoriesStatus,
    skills: skillsList = [],
    skillsStatus,
  } = useSelector((state) => state.categories);

  const { jobs = [], status, error } = useSelector((state) => state.jobs);

  // Fetch categories, skills, and subcategories when needed
  useEffect(() => {
    if (categoriesStatus === 'idle') dispatch(fetchCategories());
    if (skillsStatus === 'idle') dispatch(fetchSkills());
  }, [categoriesStatus, skillsStatus, dispatch]);

  useEffect(() => {
    if (filters.category) {
      dispatch(fetchSubcategories(filters.category));
    }
  }, [filters.category, dispatch]);

  // Fetch jobs whenever filters change
  useEffect(() => {
    const { category, subcategory, role, skills } = filters;

    // Update URL
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    if (role) params.set('role', role);
    if (skills.length > 0) params.set('skills', skills.join(','));
    navigate(`/jobs?${params.toString()}`, { replace: true });

    // Fetch jobs from Redux
    dispatch(fetchJobsByCategoryOrSubcategory({
      categoryName: category,
      subcategoryName: subcategory,
      role,
      skills,
    }));
  }, [filters, dispatch, navigate]);

  // Handlers
  const handleCategoryChange = (e) =>
    setFilters((prev) => ({ ...prev, category: e.target.value, subcategory: '' }));
  const handleSubcategoryChange = (e) =>
    setFilters((prev) => ({ ...prev, subcategory: e.target.value }));
  const handleRoleChange = (e) =>
    setFilters((prev) => ({ ...prev, role: e.target.value }));
  const handleSkillToggle = (skillName) =>
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillName)
        ? prev.skills.filter((s) => s !== skillName)
        : [...prev.skills, skillName],
    }));

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Category */}
       
        

         

          {/* Skills */}
          <div className="flex flex-col w-full sm:w-1/4">
            <label className="text-gray-700 font-medium mb-1">Skills</label>
            {skillsStatus === 'loading' && <p className="text-gray-500 text-sm">Loading skills...</p>}
            {skillsStatus === 'succeeded' && (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border rounded p-2">
                {skillsList.map(skill => {
                  const skillName = skill.name || skill;
                  const selected = filters.skills.includes(skillName);
                  return (
                    <label
                      key={skill.id || skillName}
                      className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer border transition ${
                        selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleSkillToggle(skillName)}
                      />
                      <span>{skillName}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Jobs list */}
        {status === 'loading' && <p className="text-center text-gray-500">Loading jobs...</p>}
        {status === 'failed' && <p className="text-center text-red-600">{error}</p>}
        {status === 'succeeded' && jobs.length === 0 && <p className="text-center text-gray-600">No jobs found.</p>}
        {status === 'succeeded' && jobs.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => <JobCard key={job.id || job._id} job={job} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;
