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
import DatePicker from "react-datepicker";
import "./Food_Styling.css";
import "react-datepicker/dist/react-datepicker.css";
const URL =
  "whats-in-the-fridge-e2f8g5etfbarcmdk.westus-01.azurewebsites.net";

function Food() {
  const navigate = useNavigate();
  //state to store input values
  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("Fruit");
  const [location, setLocation] = useState("Fridge");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date());

  const [addButtonText, setButtonText] = useState("Add");

  //function to go back
  const handleBack = () => {
    navigate(-1);
  };

  async function getHouses(token) {
    if (!token) return [];
    try {
      const res = await fetch(`https://${URL}/userhouses`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401 || res.status === 404) {
        navigate("/login");
        return [];
      } else {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.error("Error fetching houses:", err);
    }
  }

  async function addFoodToDatabase() {
    setButtonText("Adding...");

    const token = localStorage.getItem("token");

    if (token) {
      const houses = await getHouses(token);
      if (
        !houses.housesByUser ||
        (houses.housesByUser.length == 0 &&
          !houses.defaultHouse)
      ) {
        alert("No Houses found for your user");
        setButtonText(`Unable to add ${foodName}`);
        //NO HOUSE, PROMPT TO CREATE HOUSE
      } else {
        // Use the defaultHouse if it exists; otherwise, use the first house
        const houseToUse =
          houses.defaultHouse != null
            ? houses.defaultHouse
            : houses.housesByUser[0];
        fetch(`/houses/${houseToUse._id}/food/${location}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            FoodName: foodName,
            FoodType: foodType,
            Location: location,
            Amount: quantity,
            ExpirationDate: date
          })
        })
          .then((res) => {
            if (res.status == 201) {
              setButtonText(`${foodName} added`);
              setTimeout(() => {
                setButtonText("Add");
              }, 1000);
            } else {
              setButtonText("Invalid date");
              setTimeout(() => {
                setButtonText("Add");
              }, 2000);
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
    }
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
        <option value="Fats & Oils">FATS & OILS</option>
        <option value="Sugars & Sweets">SUGARS & SWEETS</option>
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
        <option value="Freezer">FREEZER</option>
        <option value="Pantry">PANTRY</option>
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
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
      />

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
