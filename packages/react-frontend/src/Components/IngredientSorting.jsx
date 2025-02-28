import React, { useState } from "react";

const categories = [
  "All",
  "Fruits",
  "Vegetables",
  "Grains",
  "Protein",
  "Dairy",
  "Fats & Oils",
  "Sugars & Sweets",
];

export default function IngredientFilter({ ingredients }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredIngredients =
    selectedCategory === "All"
      ? ingredients
      : ingredients.filter((item) => item.group === selectedCategory);

  return (
    <div className="p-4">  
      <div className="flex overflow-x-auto space-x-4 p-2 bg-gray-100 rounded-lg">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Filtered Ingredients List */}
      <div className="mt-4">
        {filteredIngredients.length > 0 ? (
          filteredIngredients.map((item) => (
            <div key={item.name} className="p-2 border-b">
              {item.name}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No ingredients found for this category.</p>
        )}
      </div>
    </div>
  );
}
