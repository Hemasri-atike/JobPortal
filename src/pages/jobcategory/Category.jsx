import React, { useEffect } from 'react';
import { Code, Heart, Briefcase } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/categoriesSlice.js';
import { Link } from 'react-router-dom';

const Category = () => {
  const dispatch = useDispatch();
  const { categories = [], status, error } = useSelector((state) => state.categories);

  const iconMap = { Code, Heart, Briefcase };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  return (
    <section className="py-8 sm:py-12 bg-gray-50 lg:py-16">
      <div className="w-full mx-auto max-w-[1180px]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
            Popular Job Categories
          </h3>

          {status === 'loading' && (
            <div className="text-center" aria-live="polite">
              <svg
                className="animate-spin h-5 w-5 text-blue-600 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="sr-only">Loading categories...</span>
            </div>
          )}

          {status === 'failed' && (
            <p
              className="text-center text-red-600 p-3 bg-red-50 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              {error || 'Failed to load categories. Please try again later.'}
            </p>
          )}

          {status === 'succeeded' && categories.length === 0 && (
            <p className="text-center text-gray-600 p-3 bg-white rounded-md shadow-sm" aria-live="polite">
              No categories available.
            </p>
          )}

          {status === 'succeeded' && categories.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category, index) => {
                const categoryName = category.name || 'Unnamed Category';
                const openPositions = category.openPositions ?? 0;
                const IconComponent = iconMap[category.icon] || Briefcase;
                const bgColor = category.bgColor || 'bg-blue-100';
                const iconColor = category.iconColor || 'text-blue-700';

                return (
                  <Link 
                    key={categoryName} 
                    to={`/categories/${encodeURIComponent(categoryName)}`} // ✅ Use name instead of ID
                    className="p-3 bg-white border border-gray-200 rounded-lg shadow-md hover-bg-gray-50 hover:shadow-xl transition duration-200 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`View subcategories for ${categoryName} with ${openPositions} open positions`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-10 h-10 ${bgColor} rounded-md flex items-center justify-center`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${iconColor}`}
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-1">
                        {categoryName}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-xs">
                      {openPositions} open position{openPositions !== 1 ? 's' : ''}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Category;
