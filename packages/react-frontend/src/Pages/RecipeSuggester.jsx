import React from "react";
import Toolbar from "../Components/Toolbar.jsx";
const URL =
  "whats-in-the-fridge-e2f8g5etfbarcmdk.westus-01.azurewebsites.net";

function RecipeSuggester() {
  return (
    <div className="container">
      <Toolbar selected="Recipes" />

      <label htmlFor="name">Recipe Suggester</label>
    </div>
  );
}

export default RecipeSuggester;
