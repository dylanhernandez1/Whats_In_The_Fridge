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

  function getExpiringList(token) {
    if (token) {
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
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const millisPerDay = 24 * 60 * 60 * 1000;
        const currentDate = new Date();
        res.map((food) => {
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
        setFoodList(res);
        setTempFoodList(res);
        console.log("Foods: ", res);
        return res;
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
