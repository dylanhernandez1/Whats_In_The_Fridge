import React, { useState } from "react";

const categories = [
  "All",
  "Fruits",
  "Vegetables",
  "Grains",
  "Protein",
  "Dairy",
  "Fats & Oils",
  "Sugars & Sweets"
];

export default function IngredientFilter({ ingredients }) {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredIngredients =
    selectedCategory === "All"
      ? ingredients
      : ingredients.filter(
          (item) => item.type === selectedCategory
        );

        return (
          <div className="ingredient-filter-container">
            <div className="ingredient-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "active" : ""}
                >
                  {category}
                </button>
              ))}
            </div>
        
            {/* Filtered Ingredients List */}
            <div className="ingredients-list">
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map((item) => (
                  <div key={item.name} className="ingredient-item">
                    {item.name}
                  </div>
                ))
              ) : (
                <p className="no-ingredients">
                  No ingredients found for this category.
                </p>
              )}
            </div>
          </div>
        );
      }        