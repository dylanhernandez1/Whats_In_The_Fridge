// src/Table.jsx
import React from "react";
import Toolbar from "./Toolbar";
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
      <Toolbar />

      <label htmlFor="name">
        We are in the profile section
      </label>
    </div>
  );
}

export default Profile;
