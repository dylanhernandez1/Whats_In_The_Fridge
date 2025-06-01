import React, { useState, useEffect } from "react";
import Toolbar from "../Components/Toolbar";
import URL from "./Url";
import "../Components/Header_Styling.css";
import { useNavigate } from "react-router-dom";
import Popup from "../Components/Popup.jsx";
import IngredientSorting from "../Components/IngredientSorting.jsx";

function GroceryList() {
  const [groceryList, setGroceryList] = useState([{}]);
  const [foodInfo, setFoodInfo] = useState(undefined);

  const navigate = useNavigate();

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

  async function getGroceryList(token) {
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

        const res = await fetch(
          `${URL}/houses/${houseToUse._id}/food/groceryList`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          const errorText = await res.text().catch(() => "");
          throw new Error(
            `Failed to fetch food: ${errorText || res.statusText}`
          );
        }

        return res;
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    getGroceryList(token)
      .then(async (res) => {
        if (!res) {
          return [];
        }
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        const data = await res.json();
        setGroceryList(data);
        console.log("Foods: ", data);
        return data;
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, [navigate]);

  function onCardClick(foodInfo) {
    setFoodInfo(foodInfo);
  }

  function onClose() {
    setFoodInfo(undefined);
  }

  async function onDelete(id) {
    const token = localStorage.getItem("token");

    try {
      // Delete the food item
      const deleteRes = await fetch(`${URL}/food/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (deleteRes.status !== 201) {
        const errorText = await deleteRes
          .text()
          .catch(() => "");
        throw new Error(
          `Delete failed: ${errorText || deleteRes.statusText}`
        );
      }

      // Refresh the user's houses
      const houses = await getHouses(token);
      const houseToUse =
        houses.defaultHouse != null
          ? houses.defaultHouse
          : houses.housesByUser[0]?.house;

      if (!houseToUse) {
        throw new Error("No house found for this user");
      }

      // Update house information
      const updateRes = await fetch(
        `${URL}/houses/updateFood/${houseToUse._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ deletedFoodId: id })
        }
      );

      if (!updateRes.ok) {
        const errorText = await updateRes
          .text()
          .catch(() => "");
        throw new Error(
          `Failed to update house: ${errorText || updateRes.statusText}`
        );
      }

      // Update UI state
      setGroceryList(
        groceryList.filter((food) => food._id !== id)
      );
      setFoodInfo(undefined);
    } catch (error) {
      console.error("Error deleting food:", error);
      // Optional: show a toast or UI error message
    }
  }

  return (
    <div className="app-container">
      <Toolbar selected="Groceries" />
      <div className="content-container-spaced">
        <header className="header-container">
          <b>Grocery List</b>
        </header>
        <Popup
          popupType="FoodPopup"
          foodInfo={foodInfo}
          onDelete={onDelete}
          onClose={onClose}
        />
        <IngredientSorting
          ingredients={groceryList}
          onClick={onCardClick}
        />
      </div>
    </div>
  );
}

export default GroceryList;
