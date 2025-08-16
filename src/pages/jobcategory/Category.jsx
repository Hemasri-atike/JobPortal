
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

const Category = () => {
  const categories = [
    {
      id: 1,
      name: "Accounting / Finance",
      openPositions: 2,
      icon: Calculator,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      name: "Marketing",
      openPositions: 86,
      icon: Megaphone,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 3,
      name: "Design",
      openPositions: 43,
      icon: Palette,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 4,
      name: "Development",
      openPositions: 12,
      icon: Code,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 5,
      name: "Human Resource",
      openPositions: 55,
      icon: Users,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: 6,
      name: "Automotive Jobs",
      openPositions: 2,
      icon: Car,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: 7,
      name: "Customer Service",
      openPositions: 2,
      icon: Headphones,
      iconColor: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      id: 8,
      name: "Health and Care",
      openPositions: 25,
      icon: Heart,
      iconColor: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      id: 9,
      name: "Project Management",
      openPositions: 92,
      icon: Briefcase,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
            Popular Job Categories
          </h2>
          {/* <p className="text-gray-500 text-base sm:text-lg lg:text-xl">
            2020 jobs live - 293 added today.
          </p> */}
        </div>

        {/* Categories grid */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-7xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="p-4 sm:p-6 bg-white rounded-lg  hover:shadow-lg transition-all duration-300 group cursor-pointer hover:-translate-y-1"
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
      </div>
      
    </section>
  );
};

export default Category;

