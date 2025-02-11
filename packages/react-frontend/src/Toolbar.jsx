// src/Table.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Toolbar() {
  const navigate = useNavigate();

  function navToProfile() {
    navigate("/profile");
  }

  function navToGroceryList() {
    navigate("/grocery-list");
  }

  function navToHome() {
    navigate("/");
  }

  function navToRecipeSuggester() {
    navigate("/recipe-suggester");
  }

  //Full table
  return (
    <div className="container">
      <div>
        <button onClick={navToHome}>Home</button>
        <button onClick={navToProfile}>Profile</button>
        <button onClick={navToGroceryList}>My Groceries</button>
        <button onClick={navToRecipeSuggester}>
          Reciper Suggester
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
