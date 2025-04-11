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
import "./Toolbar_styling.css";

// main toolbar
function Toolbar({ selected }) {
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
      <button
        onClick={() => navigate("/")}
        className={selected === "Home" ? "selected" : ""}
      >
        <FaHome className="icon" />
        <span className="button-text">Home</span>
      </button>
      <button
        onClick={() => navigate("/food")}
        className={selected === "Food" ? "selected" : ""}
      >
        <FaUtensils className="icon" />
        <span className="button-text">Food</span>
      </button>
      <button
        onClick={() => navigate("/grocery-list")}
        className={selected === "Groceries" ? "selected" : ""}
      >
        <FaShoppingCart className="icon" />
        <span className="button-text">Groceries</span>
      </button>
      <button
        onClick={() => navigate("/recipe-suggester")}
        className={selected === "Recipes" ? "selected" : ""}
      >
        <FaBook className="icon" />
        <span className="button-text">Recipes</span>
      </button>
      <button
        onClick={() => navigate("/profile")}
        className={selected === "Profile" ? "selected" : ""}
      >
        <FaUser className="icon" />
        <span className="button-text">Profile</span>
      </button>
    </div>
  );
}

export default Toolbar;
