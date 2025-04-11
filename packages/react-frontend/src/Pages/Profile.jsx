// src/Table.jsx
import React, { useState } from "react";
import Toolbar from "../Components/Toolbar.jsx";
import { useNavigate } from "react-router-dom";
import "../Components/Profile_page.css";
import ProfileToolbar from "../Components/profile_bar.jsx";

function Profile() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] =
    useState("User");

  function navToSettings() {
    navigate("./account-settings");
  }
  function manageHouses() {
    navigate("./houses");
  }

  //Renders content based on the Profile Toolbar selection
  function renderContent() {
    switch (selectedSection) {
      case "User":
        return <div>This is the User section.</div>;
      case "Houses":
        return <div>This is the Houses section.</div>;
      case "Other Settings":
        return <div>This is the Other Settings section.</div>;
      default:
        return (
          <div>Select an option from the profile toolbar.</div>
        );
    }
  }

  //Full table
  return (
    <div className="app-container">
      <Toolbar selected="Profile" />
      <div className="content-container-spaced">
        <header className="header-container">
          <b>User</b>
        </header>
        <ProfileToolbar
          onSelectSection={setSelectedSection}
          selectedSection={selectedSection}
        />
        <div classname="profile-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Profile;
