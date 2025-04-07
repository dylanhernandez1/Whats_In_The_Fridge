// src/Table.jsx
import React from "react";
import Toolbar from "../Components/Toolbar.jsx";
import { useNavigate } from "react-router-dom";
import "../Components/Profile_page.css";
import ProfileToolbar from "../Components/profile_bar.jsx";

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
    <div className="app-container">
      <Toolbar/>
      <div className="content-container-spaced">
        <header className="header-container">
          <b>User</b>
        </header>
        <ProfileToolbar />
    </div>
    </div>
  );
}

export default Profile;
