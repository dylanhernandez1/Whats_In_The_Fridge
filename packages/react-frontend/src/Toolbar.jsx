// src/Table.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./StyleSheet.css";

function Toolbar() {
  const navigate = useNavigate();
  //TEMPORARY THING TO JUST MAKE IT BLACK AND WHITE
  const Style = {
    color: "black",
    backgroundColor: "white",
    borderColor: "black"
  };

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

  function navToFood() {
    navigate("/food");
  }

  //Full table
  return (
    <div className="buttons">
      <div>
        <button onClick={navToHome}>Home</button>
        <button onClick={navToProfile}>Profile</button>
        <button onClick={navToGroceryList}>My Groceries</button>
        <button onClick={navToRecipeSuggester}>
          Reciper Suggester
        </button>
        <button onClick={navToFood}>Food</button>
      </div>
    </div>
  );
}

export default Toolbar;
