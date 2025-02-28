// src/Table.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaUtensils,
  FaBook
} from "react-icons/fa";
import "./StyleSheet.css";

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

  function navToFood() {
    navigate("/food");
  }
  //Full table
  return (
    <div className="toolbar">
      <button onClick={navToHome}>
        <FaHome className="icon" />
        <span className="button-text">Home</span>
      </button>
      <button onClick={navToFood}>
        <FaUtensils className="icon" />
        <span className="button-text">Food</span>
      </button>
      <button onClick={navToGroceryList}>
        <FaShoppingCart className="icon" />
        <span className="button-text">Groceries</span>
      </button>
      <button onClick={navToRecipeSuggester}>
        <FaBook className="icon" />
        <span className="button-text">Recipes</span>
      </button>
      <button onClick={navToProfile}>
        <FaUser className="icon" />
        <span className="button-text">Profile</span>
      </button>
    </div>
  );
}

export default Toolbar;
