// src/Table.jsx
import React from "react";
import Toolbar from "../Components/Toolbar.jsx";
import SearchBar from "../Components/SearchBar.jsx";
import ExpiringList from "../Components/ExpiringList.jsx";
import "../Components/StyleSheet.css";

function Home({ characters, removeOneCharacter, updateList }) {
  //Full table
  return (
    <div className="container">
      <Toolbar />
      <header className="header-container">
        <b>What's In My Fridge?</b>
      </header>
      <SearchBar />
      <ExpiringList />
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
