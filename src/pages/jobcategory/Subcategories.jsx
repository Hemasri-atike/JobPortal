import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubcategories } from "../../store/categoriesSlice.js";

const Subcategories = () => {
  const { name } = useParams();
  const dispatch = useDispatch();

  const { subcategories = [], subcategoriesStatus, subcategoriesError } = useSelector(
    (state) => state.categories
  );

  // Fetch subcategories when category changes
  useEffect(() => {
    if (name) dispatch(fetchSubcategories(name));
  }, [name, dispatch]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subcategories */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
          {name ? `${name} Subcategories` : "Subcategories"}
        </h2>

        {subcategoriesStatus === "loading" && (
          <p className="text-center text-gray-500">Loading subcategories...</p>
        )}
        {subcategoriesStatus === "failed" && (
          <p className="text-center text-red-600">{subcategoriesError}</p>
        )}
        {subcategoriesStatus === "succeeded" && subcategories.length === 0 && (
          <p className="text-center text-gray-600">No subcategories found.</p>
        )}

        {subcategoriesStatus === "succeeded" && subcategories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((sub) => (
              <Link
                key={sub.id || sub.name}
                to={`/jobs?subcategory=${encodeURIComponent(sub.name)}`}
                className="p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 block"
              >
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2">{sub.name}</h3>
                <p className="text-gray-600 text-sm">
                  {sub.open_positions ?? 0} open position{sub.open_positions !== 1 ? "s" : ""}
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
