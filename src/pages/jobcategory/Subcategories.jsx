import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Subcategories = () => {
  const { id } = useParams(); // category id
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/categories/${id}`);
        // Ensure subcategories is always an array
        setCategory({ ...res.data, subcategories: res.data.subcategories || [] });
      } catch (err) {
        console.error(err);
        setError("Failed to load subcategories");
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!category) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{category.name} Subcategories</h2>

        {category.subcategories.length === 0 ? (
          <p>No subcategories available.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/jobs?subcategory=${sub.id}`}
                className="p-6 bg-white rounded shadow hover:shadow-lg transition block"
              >
                <h3 className="font-semibold text-lg">{sub.name}</h3>
                <p className="text-gray-500">{sub.openPositions ?? 0} open positions</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Subcategories;
