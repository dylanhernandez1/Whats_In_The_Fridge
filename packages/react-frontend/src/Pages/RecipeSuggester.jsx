import React, { useEffect, useState } from "react";
import Toolbar from "../Components/Toolbar.jsx";
import "../Components/RecipeSuggestor_styling.css";
import URL from "./Url";

function RecipeSuggester() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  async function getHouses(token) {
    if (!token) return [];
    try {
      const res = await fetch(`${URL}/userhouses`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message =
          errorData?.error || `HTTP ${res.status}`;
        console.error("Error from /userhouses:", message);
        navigate("/login");
        return [];
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching houses:", err);
      return [];
    }
  }

  const getRecipeSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    const token = localStorage.getItem("token");
    if (token) {
      const houses = await getHouses(token);
      console.log(houses);
      if (
        !houses.housesByUser ||
        (houses.housesByUser.length == 0 &&
          !houses.defaultHouse)
      ) {
        alert("No Houses found for your user");
        //NO HOUSE, PROMPT TO CREATE HOUSE
      } else {
        // Use the defaultHouse if it exists; otherwise, use the first house
        const houseToUse =
          houses.defaultHouse != null
            ? houses.defaultHouse
            : houses.housesByUser[0]?.house;
        if (!houseToUse || !houseToUse._id) {
          alert("No valid house found with an _id");
          return;
        }
        try {
          const response = await fetch(
            `${URL}/suggest-recipe/${houseToUse._id}`
          ); //Update route if needed
          if (!response.ok) {
            throw new Error("Failed to fetch recipe");
          }
          //ADJUST PULLING RESPONSE HERE ONCE BACKEND READY
          const data = await response.json();
          setRecipe(data.recipe); //Get the output
        } catch (err) {
          setError(err.message);
        }
        setIsLoading(false);
      }
    }
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
