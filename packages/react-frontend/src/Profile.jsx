// src/Table.jsx
import React from "react";
import Table from "./Table";
import Form from "./Form";
import { useNavigate } from "react-router-dom";

function Profile({
  characters,
  removeOneCharacter,
  updateList
}) {
  const navigate = useNavigate();

  function switchToHome() {
    navigate("/");
  }
  //Full table
  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />

      <Form handleSubmit={updateList} />
      <label htmlFor="name">omg it works!!!!!!!</label>
      <div>
        <button onClick={switchToHome}>Home</button>
      </div>
    </div>
  );
}

export default Profile;
