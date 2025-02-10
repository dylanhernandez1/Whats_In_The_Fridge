// src/Table.jsx
import React from "react";
import Table from "./Table";
import Form from "./Form";

function Home({characters, removeOneCharacter, updateList}) {
  //Full table
  return (
    <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} />
  </div>
  );
}

export default Home;
