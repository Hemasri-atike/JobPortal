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

  console.log('Category component rendered:', { status, categories, error });

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-10">
          Popular Job Categories
        </h3>

        {status === 'loading' && (
          <p className="text-center text-gray-500" aria-live="polite">
            Loading categories...
          </p>
        )}

        {status === 'failed' && (
          <p
            className="text-center text-red-500"
            role="alert"
            aria-live="assertive"
          >
            Failed to load categories. Please try again later.
          </p>
        )}

        {status === 'succeeded' && categories.length === 0 && (
          <p className="text-center text-gray-500" aria-live="polite">
            No categories available.
          </p>
        )}

        {status === 'succeeded' && categories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category, index) => {
              // Validate category data
              const categoryId = category.id || `category-${index}`;
              const categoryName = category.name || 'Unnamed Category';
              const openPositions = category.openPositions ?? 0;
              const IconComponent = iconMap[category.icon] || Briefcase;
              const bgColor = category.bgColor || 'bg-blue-100';
              const iconColor = category.iconColor || 'text-blue-700';

              return (
                <Link
                  key={categoryId}
                  to={`/categories/${category.id}`}
                  className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 block focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`View jobs in ${categoryName} category with ${openPositions} open positions`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <IconComponent
                        className={`w-7 h-7 ${iconColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">
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