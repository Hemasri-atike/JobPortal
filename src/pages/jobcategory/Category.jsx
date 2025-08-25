import React, { useEffect } from "react";
import {
  Calculator,
  Megaphone,
  Palette,
  Code,
  Users,
  Car,
  Headphones,
  Heart,
  Briefcase,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/jobsSlice.js";

const Category = () => {
  const dispatch = useDispatch();
  const { categories, categoriesStatus, categoriesError } = useSelector(
    (state) => state.jobs
  );

  const iconMap = {
    Calculator,
    Megaphone,
    Palette,
    Code,
    Users,
    Car,
    Headphones,
    Heart,
    Briefcase,
  };

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
            Popular Job Categories
          </h2>
        </div>

        {categoriesStatus === "loading" && (
          <div className="text-center text-gray-500">Loading categories...</div>
        )}
        {categoriesStatus === "failed" && (
          <div className="text-center text-red-500">Error: {categoriesError}</div>
        )}

        {categoriesStatus === "succeeded" && (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-7xl mx-auto">
            {categories.map((category, index) => {
              const IconComponent = iconMap[category.icon] || Briefcase;
              // Use combination of id + index as unique key
              const uniqueKey = `${category.id}-${index}`;
              return (
                <div
                  key={uniqueKey}
                  className="p-4 sm:p-6 bg-white rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 ${category.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}
                    >
                      <IconComponent
                        className={`w-6 h-6 sm:w-8 sm:h-8 ${category.iconColor}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        ({category.openPositions} open position
                        {category.openPositions !== 1 ? "s" : ""})
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
