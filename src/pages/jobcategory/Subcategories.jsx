import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubcategories } from '../../store/categoriesSlice.js';

const Subcategories = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { categories, subcategories = [], subcategoriesStatus, subcategoriesError } = useSelector(
    (state) => state.categories
  );
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    dispatch(fetchSubcategories(id));

    // Fetch category name only if not in Redux store
    const category = categories.find((cat) => cat.id.toString() === id);
    if (category) {
      setCategoryName(category.name || 'Category');
    } else {
      const fetchCategoryName = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (!res.ok) throw new Error('Failed to fetch category');
          const data = await res.json();
          setCategoryName(data.name || 'Category');
        } catch (err) {
          setCategoryName('Category');
        }
      };
      fetchCategoryName();
    }
  }, [id, dispatch, categories]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
          {categoryName} Subcategories
        </h2>

        {subcategoriesStatus === 'loading' && (
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
            <span className="sr-only">Loading subcategories...</span>
          </div>
        )}

        {subcategoriesStatus === 'failed' && (
          <p
            className="text-center text-red-600 p-4 bg-red-50 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {subcategoriesError || 'Failed to load subcategories. Please try again later.'}
          </p>
        )}

        {subcategoriesStatus === 'succeeded' && subcategories.length === 0 && (
          <p className="text-center text-gray-600 p-4 bg-white rounded-md shadow-sm" aria-live="polite">
            No subcategories available.
          </p>
        )}

        {subcategoriesStatus === 'succeeded' && subcategories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((sub) => (
              <Link
                key={sub.id || `subcategory-${sub.name}`}
                to={`/jobs?subcategory=${sub.id}`}
                className="p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`View jobs in ${sub.name} subcategory with ${sub.open_positions ?? 0} open positions`}
              >
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2">
                  {sub.name || 'Unnamed Subcategory'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {sub.open_positions ?? 0} open position{sub.open_positions !== 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Subcategories;