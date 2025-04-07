// src/Table.jsx
//import React from "react";
import React, { useState, useEffect } from "react";
import Toolbar from "../Components/Toolbar.jsx";
import SearchBar from "../Components/SearchBar.jsx";
import ExpiringList from "../Components/ExpiringList.jsx";
import Menu from "../Components/Menu.jsx";
import Notifications from "../Components/Notifications.jsx";
import IngredientSorting from "../Components/IngredientSorting.jsx";
import "../Components/Header_styling.css";

function Home({}) {
  const [foodList, setFoodList] = useState([{}]);
  const [tempFoodList, setTempFoodList] = useState([{}]);
  const [searchText, setSearchText] = useState("");
  const [menuText, setMenuText] = useState("");

  function getExpiringList() {
    const promise = fetch(`http://localhost:8000/expiring`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return promise;
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
    getExpiringList()
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
  }, []);

  //Full table
  return (
    <div className="app-container">
      <Toolbar />
      <div className="content-container-spaced">
        <header className="header-container">
          <Menu onMenuSwitch={handleMenuSwitch} />
          <b>What's In My Fridge?</b>
          <Notifications foodList={foodList} />
        </header>

        <SearchBar onTextSubmit={handleSearchText} />
        <ExpiringList foodList={foodList} />
        <IngredientSorting ingredients={tempFoodList} />
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
