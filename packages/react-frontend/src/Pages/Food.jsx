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
import Popup from "../Components/Popup.jsx";
import "./Food_Styling.css";
import "react-datepicker/dist/react-datepicker.css";
import URL from "./Url";

function Food() {
  const navigate = useNavigate();
  //state to store input values
  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("Fruit");
  const [location, setLocation] = useState("fridge");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date());
  const [foodImage, setFoodImage] = useState(undefined);
  const [imageList, setImageList] = useState(undefined);

  const [addButtonText, setButtonText] = useState("Add");

  //function to go back
  const handleBack = () => {
    navigate(-1);
  };

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

  // Set the image parameter of the food item, then add the food to the database
  function selectImage(imgURL) {
    setFoodImage(imgURL);
    addFoodToDatabase();
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
            : houses.housesByUser[0]?.house;
        fetch(
          `${URL}/houses/${houseToUse._id}/food/${location}`,
          {
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
              ExpirationDate: date,
              FoodImage: foodImage
            })
          }
        )
          .then((res) => {
            // Status code for success but no content, meaning the post was successful to the database
            if (res.status == 204) {
              setButtonText(`${foodName} added`);
              // TODO: reset foodImage to undefined
              setTimeout(() => {
                setButtonText("Add");
              }, 1000);
              // Status code for success but with content, meaning there are images for the user to select from
              // Enable the images popup and wait for the user to select
            } else if (res.status == 200) {
              res.json().then((json) => {
                setImageList(json);
                console.log(json);
              });
            } else {
              setButtonText("Invalid date");
              setTimeout(() => {
                setButtonText("Add");
              }, 2000);
            }
            console.log();
          })
          .catch((error) => {
            setButtonText(`Unable to add ${foodName}`);
            // TODO: reset foodImage to undefined
            setTimeout(() => {
              setButtonText("Add");
            }, 1000);
            console.error("Error: ", error);
          });
      }
    }
  }

  return (
    <div className="content-container-spaced">
      <Popup 
        popupType="ImagePopup"
        foodInfo={imageList}
        onDelete={selectImage}
      />
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
        <option value="fridge">FRIDGE</option>
        <option value="freezer">FREEZER</option>
        <option value="pantry">PANTRY</option>
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
        onClick={() => {
          // Only run if the database isn't in the process of adding food
          if (addButtonText !== "Add") {
            return;
          }
          addFoodToDatabase();
        }}
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
