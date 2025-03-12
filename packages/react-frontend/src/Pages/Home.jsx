// src/Table.jsx
//import React from "react";
import React, { useState } from "react";
import Toolbar from "../Components/Toolbar.jsx";
import SearchBar from "../Components/SearchBar.jsx";
import ExpiringList from "../Components/ExpiringList.jsx";
import Menu from "../Components/Menu.jsx";
import Notifications from "../Components/Notifications.jsx";
import IngredientSorting from "../Components/IngredientSorting.jsx";
import "../Components/Header_styling.css";

function Home({ characters, removeOneCharacter, updateList }) {
  const [foodList, setFoodList] = useState([
    {
      id: 1234,
      name: "Apple",
      expirationDate: 1,
      location: "Fridge",
      type: "Fruits"
    },
    {
      id: 2345,
      name: "Cheese",
      expirationDate: 3,
      location: "Fridge",
      type: "Dairy"
    },
    {
      id: 3456,
      name: "Banana",
      expirationDate: 6,
      location: "Fridge",
      type: "Fruits"
    },
    {
      id: 4567,
      name: "Eggs",
      expirationDate: 7,
      location: "Fridge",
      type: "Protein"
    },
    {
      id: 5678,
      name: "Crackers",
      expirationDate: 9,
      location: "Pantry",
      type: "Grains"
    },
    {
      id: 6789,
      name: "Water",
      expirationDate: 200,
      location: "Pantry",
      type: "Other"
    }
  ]);

  //Full table
  return (
    <div className="app-container">
  <Toolbar />
  <div className="content-container-spaced">
    <header className="header-container">
      <Menu />
      <b>What's In My Fridge?</b>
      <Notifications foodList={foodList} />
    </header>

    <SearchBar />
    <ExpiringList foodList={foodList} />
    <IngredientSorting ingredients={foodList} />
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
