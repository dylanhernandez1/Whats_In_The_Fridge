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
import "../Components/Header_styling.css";
import { useNavigate } from "react-router-dom";

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
      const res = fetch(`http://localhost:8000/userhouses`, {
        method: "GET",
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

  async function getExpiringList(token) {
    if (token) {
      const houses = await getHouses(token);
      console.log(houses);
      if (!houses || houses.length === 0) {
        alert("No Houses found for your user");
        //NO HOUSE, PROMPT TO CREATE HOUSE
      } else {
        fetch(
          `http://localhost:8000/houses/${houses[0]._id}/food`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        ).then((res) => {
          return res.json();
        });
      }
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

    // If no token, redirect to login
    if (!token) {
      navigate("/login");
    }

    getExpiringList(token)
      .then(async (res) => {
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

  function onDelete(id) {
    fetch(`http://localhost:8000/food`, {
      method: "DELETE",
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

/*
<label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={person.name}
        onChange={handleChange}
      />
      <label htmlFor="job">Job</label>
      <input
        type="text"
        name="job"
        id="job"
        value={person.job}
        onChange={handleChange}
      />
*/
