// src/Table.jsx
import React from "react";
import Toolbar from "../Components/Toolbar.jsx";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  function navToSettings() {
    navigate("./account-settings");
  }
  function manageHouses() {
    navigate("./houses");
  }

  //Full table
  return (
    <div className="container">
      <Toolbar />

      <label htmlFor="name">
        We are in the profile section
      </label>
      <div>
        <button onClick={navToSettings}>
          Account Settings
        </button>
      </div>
      <div>
        <button onClick={manageHouses}>Manage Houses</button>
      </div>
    </div>
  );
}

export default Profile;
