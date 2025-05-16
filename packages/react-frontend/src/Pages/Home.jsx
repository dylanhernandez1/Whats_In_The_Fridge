// src/Table.jsx
//import React from "react";
import React, { useState, useEffect } from "react";
import Toolbar from "../Components/Toolbar.jsx";
import SearchBar from "../Components/SearchBar.jsx";
import ExpiringList from "../Components/ExpiringList.jsx";
import Menu from "../Components/Menu.jsx";
import Notifications from "../Components/Notifications.jsx";
import IngredientSorting from "../Components/IngredientSorting.jsx";
import Popup from "../Components/Popup.jsx";
import "../Components/Header_Styling.css";
import { useNavigate } from "react-router-dom";
const URL = "localhost:8000";

function Home({}) {
  const [foodList, setFoodList] = useState([{}]);
  const [tempFoodList, setTempFoodList] = useState([{}]);
  const [searchText, setSearchText] = useState("");
  const [menuText, setMenuText] = useState("");
  const [foodInfo, setFoodInfo] = useState(undefined);

  const navigate = useNavigate();

  async function getHouses(token) {
    if (!token) return [];
    try {
      const res = await fetch(`http://${URL}/userhouses`, {
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

  async function getExpiringList(token) {
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
          `http://${URL}/houses/${houseToUse._id}/food`,
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
      /*
      //OLD CODE FOR FOOD
      const promise = fetch(`http://localhost:8000/expiring`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      return promise;
    } else {
      console.log("empty cookie");
      return false;
    }
      */
    }
  }

  //FOR SEARCHBAR

  useEffect(() => {
    const filteredFoods =
      searchText.trim() == ""
        ? foodList
        : foodList.filter((food) =>
            food.FoodName.toLowerCase().includes(
              searchText.toLowerCase()
            )
          );
    const updatedList = filteredFoods.map((food) => {
      return food;
    });
    setTempFoodList(updatedList);
  }, [searchText]);

  const handleSearchText = (text) => {
    setSearchText(text);
  };

  //FOR MENU

  useEffect(() => {
    const filteredFoods = foodList.filter(
      (food) => food.Location === menuText.toLowerCase()
    );
    const updatedList = filteredFoods.map((food) => {
      return food;
    });
    setTempFoodList(updatedList);
  }, [menuText]);

  const handleMenuSwitch = (text) => {
    setMenuText(text.toLowerCase());
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    getExpiringList(token)
      .then(async (res) => {
        if (!res) {
          return [];
        }
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        const data = await res.json();
        const millisPerDay = 24 * 60 * 60 * 1000;
        const currentDate = new Date();
        data.forEach((food) => {
          if (food.ExpirationDate != undefined) {
            console.log(
              "Food name: " +
                food.FoodName +
                " | expires: " +
                food.ExpirationDate
            );
            const toDateObj = new Date(food.ExpirationDate);
            food.ExpirationDate = Math.round(
              (toDateObj - currentDate) / millisPerDay
            );
          }
        });
        data.sort(
          (a, b) => a.ExpirationDate - b.ExpirationDate
        );
        setFoodList(data);
        setTempFoodList(data);
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
      const deleteRes = await fetch(
        `http://${URL}/food/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (deleteRes.status !== 200) {
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
        `http://${URL}/houses/updateFood/${houseToUse._id}`,
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
      setFoodList(foodList.filter((food) => food._id !== id));
      setTempFoodList(
        tempFoodList.filter((food) => food._id !== id)
      );
      setFoodInfo(undefined);
    } catch (error) {
      console.error("Error deleting food:", error);
      // Optional: show a toast or UI error message
    }
  }

  //Full table
  // <IngredientSorting ingredients={tempFoodList} />
  return (
    <div className="app-container">
      <Toolbar selected="Home" />
      <div className="content-container-spaced">
        <header className="header-container">
          <Menu onMenuSwitch={handleMenuSwitch} />
          <b>What's In My Fridge?</b>
          <Notifications foodList={foodList} />
        </header>
        <SearchBar onTextSubmit={handleSearchText} />
        <Popup
          foodInfo={foodInfo}
          onDelete={onDelete}
          onClose={onClose}
        />
        <ExpiringList
          foodList={foodList}
          onClick={onCardClick}
        />
        <IngredientSorting
          ingredients={tempFoodList}
          onClick={onCardClick}
        />
      </div>
    </div>
  );
}

export default Home;
