const articles = [
  {
    date: "August 31, 2021",
    comments: "12 Comment",
    title: "Attract Sales And Profits",
    description: "A job ravenously while Far much that one rank beheld after outside....",
    image: "https://via.placeholder.com/400x250?text=Article+1",
    link: "#",
  },
  {
    date: "August 31, 2021",
    comments: "12 Comment",
    title: "5 Tips For Your Job Interviews",
    description: "A job ravenously while Far much that one rank beheld after outside....",
    image: "https://via.placeholder.com/400x250?text=Article+2",
    link: "#",
  },
  {
    date: "August 31, 2021",
    comments: "12 Comment",
    title: "Overworked Newspaper Editor",
    description: "A job ravenously while Far much that one rank beheld after outside....",
    image: "https://via.placeholder.com/400x250?text=Article+3",
    link: "#",
  },
];

export default function RecentNews() {
  return (
    <section className="bg-gray-100 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Recent News Articles
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Fresh job related news content posted each day.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Image */}
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-52 object-cover"
              />

              {/* Content */}
              <div className="p-6">
                {/* Date & Comments */}
                <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-3 space-x-2">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.comments}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{article.description}</p>

                {/* Read More */}
                <a
                  href={article.link}
                  className="text-blue-600 text-sm font-medium inline-flex items-center hover:underline"
                >
                  Read More
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
