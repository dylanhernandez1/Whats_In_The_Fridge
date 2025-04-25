import React, { useState } from "react";
import Card from "./card/Card.jsx";
import "./IngredientSorting_styling.css";

const categories = [
  "All",
  "Fruit",
  "Vegetable",
  "Grains",
  "Protein",
  "Dairy",
  "Fats & Oils",
  "Sugars & Sweets",
  "Drinks"
];

export default function IngredientList(props) {

  function onCardClick(foodInfo) {
    props.onClick(foodInfo);
  }

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredIngredients =
    selectedCategory === "All"
      ? props.ingredients
      : props.ingredients.filter(
          (item) => item.FoodType === selectedCategory
        );

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
            className={
              selectedCategory === category ? "active" : ""
            }
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
              itemInfo={item}
              onClick={onCardClick}
            />
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
