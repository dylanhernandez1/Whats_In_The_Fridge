import React from "react";
import Toolbar from "../Components/Toolbar.jsx";
import URL from "./Url";

function RecipeSuggester() {
  return (
    <div className="container">
      <Toolbar selected="Recipes" />

      <label htmlFor="name">Recipe Suggester</label>
    </div>
  );
}

export default RecipeSuggester;
