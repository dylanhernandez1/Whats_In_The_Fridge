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
const URL =
  "whats-in-the-fridge-e2f8g5etfbarcmdk.westus-01.azurewebsites.net";

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

  // Temporary function to create a default house if none is found
  // Only for testing purposes, won't be used in the final product
  async function createDefaultHouse(token) {
    const res = await fetch(`https://${URL}/houses`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        houseName: "test",
        state: "test",
        country: "test",
        town: "test"
      })
    });
    return res;
  }

  async function checkForHouses(token) {
    if (token) {
      const houses = await getHouses(token);
      if (
        !houses.housesByUser ||
        (houses.housesByUser.length == 0 &&
          !houses.defaultHouse)
      ) {
        createDefaultHouse(token)
          .then(async (res) => {
            if (res.status === 201) {
              // Successfully created a default house, now get the expiring list of the house
              getExpiringList(token);
            } else {
              console.log("Error creating a default house");
            }
          })
          .catch((error) => {
            console.error("Error: ", error);
          });
      } else {
        getExpiringList(token);
      }
    }
  }

  async function getExpiringList(token) {
    const houseToUse =
      houses.defaultHouse != null
        ? houses.defaultHouse
        : houses.housesByUser[0];
    await fetch(
      `https://${URL}/houses/${houseToUse._id}/food`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    )
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
      (food) => food.Location === menuText
    );
    const updatedList = filteredFoods.map((food) => {
      return food;
    });
    setTempFoodList(updatedList);
  }, [menuText]);

  const handleMenuSwitch = (text) => {
    setMenuText(text);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    checkForHouses(token);
  }, [navigate]);

  function onCardClick(foodInfo) {
    setFoodInfo(foodInfo);
  }

  function onClose() {
    setFoodInfo(undefined);
  }

  function onDelete(id) {
    fetch(`https://${URL}/food`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        _id: id
      })
    })
      .then((res) => {
        if (res.status == 201) {
          setFoodList(
            foodList.filter((food) => food._id !== id)
          );
          setFoodInfo(undefined);
        }
      })
      .catch((error) => {
        console.error("Error ", error);
      });
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
