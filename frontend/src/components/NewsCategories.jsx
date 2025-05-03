import React from "react";

export default function NewsCategories({
  selectedCategory,
  setSelectedCategory,
}) {
  const categories = [
    { id: "all", name: "All News" },
    { id: "politics", name: "Politics" },
    { id: "sports", name: "Sports" },
    { id: "technology", name: "Technology" },
    { id: "business", name: "Business" },
    { id: "entertainment", name: "Entertainment" },
    { id: "health", name: "Health" },
    { id: "science", name: "Science" },
    { id: "environment", name: "Environment" },
    { id: "war", name: "War" },
    { id: "international", name: "International" },
    { id: "weather", name: "Weather" },
    { id: "crime", name: "Crime" },
  ];

  return (
    <div className="absolute left-8 top-8 z-10 bg-black bg-opacity-70 rounded-lg p-4 border border-gray-700 shadow-lg">
      <h2 className="mb-3 font-bold text-white text-lg">News Categories</h2>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full bg-gray-800 text-white py-2 px-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
