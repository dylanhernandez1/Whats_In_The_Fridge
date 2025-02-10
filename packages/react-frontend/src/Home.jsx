// src/Table.jsx
import React from "react";
import Table from "./Table";
import Form from "./Form";
import Toolbar from "./Toolbar";

function Home({ characters, removeOneCharacter, updateList }) {

  //Full table
  return (
    <div className="container">
      <Toolbar />
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default Home;
