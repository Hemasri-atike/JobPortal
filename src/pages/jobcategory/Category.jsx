import React, { useEffect } from "react";
import { Code, Heart, Briefcase } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/categoriesSlice.js";
import { Link } from "react-router-dom";

const Category = () => {
  const dispatch = useDispatch();
  const { categories = [], status, error } = useSelector(
    (state) => state.categories
  );

  const iconMap = { Code, Heart, Briefcase };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-10">
          Popular Job Categories
        </h2>

        {status === "loading" && (
          <p className="text-center text-gray-500">Loading categories...</p>
        )}

        {status === "failed" && (
          <p className="text-center text-red-500">
            Error: {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        )}

        {status === "succeeded" && categories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

{categories.map((category, catIndex) => {
  const IconComponent = iconMap[category.icon] || Briefcase;
  return (
    <Link
      key={category.id || catIndex}
      to={`/categories/${category.id}`} // redirect to subcategories page
      className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition block"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-14 h-14 ${category.bgColor} rounded-xl flex items-center justify-center`}>
          <IconComponent className={`w-7 h-7 ${category.iconColor}`} />
        </div>
        <h3 className="font-semibold text-lg">{category.name}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-2">{category.openPositions} open positions</p>
    </Link>
  );
})}

          </div>
        )}

        {status === "succeeded" && categories.length === 0 && (
          <p className="text-center text-gray-500">No categories available.</p>
        )}
      </div>
    </section>
  );
};

export default Category;
