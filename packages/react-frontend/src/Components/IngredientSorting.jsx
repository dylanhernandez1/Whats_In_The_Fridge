import React, { useState } from "react";
import Card from "./card/Card.jsx";
import "./IngredientSorting_styling.css";

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

export default function IngredientList({ ingredients }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredIngredients =
    selectedCategory === "All"
      ? ingredients
      : ingredients.filter((item) => item.type === selectedCategory);

  return (
    <div className="ingredient-list-container">
      <div className="ingredient-list-header">
        <div className="ingredient-list-title">
          <b>Ingredients</b>
        </div>
        <div className="ingredient-list-see-more">See more</div>
      </div>

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

      <div className="ingredient-list scrollable-frame">
        {filteredIngredients.length > 0 ? (
          filteredIngredients.map((item) => (
            <Card
              key={item.id}
              name={item.name}
              expirationDate={item.expirationDate}
              location={item.location}
              onClick={() => {}}
            />
          ))
        ) : (
          <p className="no-ingredients">No ingredients found for this category.</p>
        )}
      </div>
    </div>
  );
}