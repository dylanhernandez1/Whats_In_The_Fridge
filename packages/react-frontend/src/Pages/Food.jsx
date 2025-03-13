/*
import React from "react";
import Toolbar from "../Components/Toolbar.jsx";

function Food() {
  return (
    <div className="container">
      <Toolbar />

      <label htmlFor="name">Add Food</label>
    </div>
  );
}

export default Food;
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../Components/Toolbar.jsx";
import "./Food_Styling.css";

function Food() {
  const navigate = useNavigate();

  //state to store input values
  const [foodName, setFoodName] = useState("");
  const [location, setLocation] = useState("Fridge");
  const [quantity, setQuantity] = useState(1);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  //function to go back
  const handleBack = () => {
    navigate(-1);
  };

  function addFoodToDatabase() {
    const promise = fetch("http://localhost:8000/food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        FoodName: foodName,
        Location: location,
        Amount: quantity,
        ExpirationDate: Date("${year}-${month}-${day}")
      })
    });
    return promise;
  }

  return (
    <div className="food-container">
      <Toolbar />

      {/* Back Button */}
      <button onClick={handleBack} className="back-button">
        {"<"}
      </button>

      {/* Page Title */}
      <h2 className="title">Add Food</h2>

      {/* Food Name Input */}
      <label>Food Name:</label>
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
      />

      {/* Location Dropdown */}
      <label>Location:</label>
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="Fridge">Fridge</option>
        <option value="Pantry">Pantry</option>
        <option value="Freezer">Freezer</option>
      </select>

      {/* Quantity Input */}
      <label>Quantity:</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />

      {/* Expiration Date */}
      <label>Expiration Date:</label>
      <div className="expiration-container">
        <input
          type="number"
          placeholder="Day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          min="1"
          max="31"
        />
        <input
          type="number"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min="1"
          max="12"
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="2024"
        />
      </div>

      <button
        className="add-button"
        onClick={() => addFoodToDatabase()}
      >
        Add
      </button>
    </div>
  );
}

export default Food;
