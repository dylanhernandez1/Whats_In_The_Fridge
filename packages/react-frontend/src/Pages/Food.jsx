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
  const [foodType, setFoodType] = useState("Fruit");
  const [location, setLocation] = useState("Fridge");
  const [quantity, setQuantity] = useState(1);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [addButtonText, setButtonText] = useState("Add");

  //function to go back
  const handleBack = () => {
    navigate(-1);
  };

  function addFoodToDatabase() {
    setButtonText("Adding...");
    const toDate = new Date(`${year}-${month}-${day}`);
    console.log(toDate);

    const promise = fetch("http://localhost:8000/food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        FoodName: foodName,
        FoodType: foodType,
        Location: location,
        Amount: quantity,
        ExpirationDate: toDate
      })
    })
      .then((res) => {
        if (res.status == 201) {
          setButtonText(`${foodName} added`);
          setTimeout(() => {
            setButtonText("Add");
          }, 1000);
        }
      })
      .catch((error) => {
        setButtonText(`Unable to add ${foodName}`);
        setTimeout(() => {
          setButtonText("Add");
        }, 1000);
        console.error("Error: ", error);
      });
  }

  return (
    <div className="food-container">
      <Toolbar selected="Food" />

      {/* Back Button */}
      <button onClick={handleBack} className="back-button">
        {"<"}
      </button>

      {/* Page Title */}
      <h2 className="title">Add Food</h2>

      {/* Food Name Input */}
      <label>FOOD NAME:</label>
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
      />

      <label>TYPE:</label>
      <select
        style={{
          fontStretch: "ultra-condensed",
          color: "grey"
        }}
        value={foodType}
        onChange={(e) => setFoodType(e.target.value)}
      >
        <option value="Fruit">FRUIT</option>
        <option value="Vegetable">VEGETABLE</option>
        <option value="Protein">PROTEIN</option>
        <option value="Dairy">DAIRY</option>
        <option value="Grains">GRAINS</option>
        <option value="Oils">FATS & OILS</option>
        <option value="Sweets">SUGARS & SWEETS</option>
        <option value="Drinks">DRINKS</option>
      </select>

      {/* Location Dropdown */}
      <label>LOCATION:</label>
      <select
        value={location}
        style={{
          fontStretch: "ultra-condensed",
          color: "grey"
        }}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="Fridge">FRIDGE</option>
        <option value="Pantry">FREEZER</option>
        <option value="Freezer">PANTRY</option>
      </select>

      {/* Quantity Input */}
      <label>QUANTITY:</label>
      <input
        style={{
          fontStretch: "ultra-condensed",
          color: "grey"
        }}
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />

      {/* Expiration Date */}
      <label>EXPIRATION DATE:</label>
      <div className="expiration-container">
        <input
          type="number"
          placeholder="DAY"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          min="1"
          max="31"
          style={{
            fontStretch: "ultra-condensed",
            color: "grey"
          }}
        />
        <input
          type="number"
          placeholder="MONTH"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min="1"
          max="12"
          style={{
            fontStretch: "ultra-condensed",
            color: "grey"
          }}
        />
        <input
          type="number"
          placeholder="YEAR"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="2024"
          style={{
            fontStretch: "ultra-condensed",
            color: "grey"
          }}
        />
      </div>

      <button
        className="add-button"
        onClick={() => addFoodToDatabase()}
        style={{
          fontStretch: "ultra-condensed",
          color: "black"
        }}
      >
        {addButtonText}
      </button>
    </div>
  );
}

export default Food;
