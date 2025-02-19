// src/Table.jsx
import React from "react";
import Table from "./Table";
import Form from "./Form";
import Toolbar from "./Toolbar";
import SearchBar from "./SearchBar";

function Home({ characters, removeOneCharacter, updateList }) {
  //Full table
  return (
    <div className="container">
      <Toolbar />

      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <SearchBar />
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
