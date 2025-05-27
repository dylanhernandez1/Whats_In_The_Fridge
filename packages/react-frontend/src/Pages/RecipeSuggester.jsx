import React, { useEffect, useState } from "react";
import Toolbar from "../Components/Toolbar.jsx";
import "../Components/RecipeSuggestor_styling.css";
import URL from "./Url";

function RecipeSuggester() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const getRecipeSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    try {
      const response = await fetch(`${URL}/suggest-recipe`); //Update route
      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }
      const data = await response.json();
      setRecipe(data.recipe); //Get the output
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="content-container-spaced">
      <Toolbar selected="Recipes" />
      <h2 className="title">Recipe Suggestor</h2>

      <button
        className="suggest-button"
        onClick={getRecipeSuggestion}
      >
        Suggest Recipe
      </button>

      <div className="result-container">
        {isLoading && <p>Loading...</p>}

        {error && (
          <p className="error-message">Error: {error}</p>
        )}

        {recipe && (
          <div className="recipe-result">
            <h2>Suggested Recipe:</h2>
            <p>{recipe}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeSuggester;
