import React, { useEffect } from 'react';
import { Code, Heart, Briefcase } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/categoriesSlice.js';
import { Link } from 'react-router-dom';

const Category = () => {
  const dispatch = useDispatch();
  const { categories = [], status, error } = useSelector((state) => state.categories);

  // Map of available icons from lucide-react
  const iconMap = { Code, Heart, Briefcase };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-10">
          Popular Job Categories
        </h3>

        {status === 'loading' && (
          <div className="text-center" aria-live="polite">
            <svg
              className="animate-spin h-6 w-6 text-blue-600 mx-auto"
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
            className="text-center text-red-600 p-4 bg-red-50 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {error || 'Failed to load categories. Please try again later.'}
          </p>
        )}

        {status === 'succeeded' && categories.length === 0 && (
          <p className="text-center text-gray-600 p-4 bg-white rounded-md shadow-sm" aria-live="polite">
            No categories available.
          </p>
        )}

        {status === 'succeeded' && categories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category, index) => {
              const categoryId = category.id || `category-${index}`;
              const categoryName = category.name || 'Unnamed Category';
              const openPositions = category.openPositions ?? 0;
              const IconComponent = iconMap[category.icon] || Briefcase;
              const bgColor = category.bgColor || 'bg-blue-100';
              const iconColor = category.iconColor || 'text-blue-700';

              return (
                <Link
                  key={categoryId}
                  to={`/categories/${categoryId}`}
                  className="p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`View subcategories for ${categoryName} with ${openPositions} open positions`}
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <div
                      className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${iconColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-1">
                      {categoryName}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {openPositions} open position{openPositions !== 1 ? 's' : ''}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;