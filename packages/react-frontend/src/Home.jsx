// src/Table.jsx
import React from "react";
import Table from "./Table";
import Form from "./Form";
import Toolbar from "./Toolbar";
import { useNavigate } from "react-router-dom";

function Home({ characters, removeOneCharacter, updateList }) {
  const navigate = useNavigate();

  function switchToProfile() {
    navigate("/profile");
  }
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
