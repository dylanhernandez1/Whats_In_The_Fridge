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
        return (
          <div className="profile-content">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john.doe@example.com</p>
            <p><strong>Address:</strong> 1234 Main St, Springfield, USA</p>
            <p><strong>Phone:</strong> (555) 123-4567</p>
            <p><strong>Birthday:</strong> January 1, 1990</p>
          </div>
        );
      case "Houses":
        return (
          <div className="profile-content">
            <p><strong>House 1:</strong> 12 Cherry Lane, San Diego, CA</p>
            <p><strong>House 2:</strong> 98 Ocean View Rd, Monterey, CA</p>
            <p><strong>House 3:</strong> 300 Pine St, Portland, OR</p>
          </div>
        );
      case "Other Settings":
        return (
          <div className="profile-content">
            <p><strong>Notifications:</strong> Enabled</p>
            <p><strong>Language:</strong> English (US)</p>
            <p><strong>Theme:</strong> Light</p>
            <p><strong>Account Status:</strong> Active</p>
          </div>
        );
      default:
        return (
          <div className="profile-content">
            <p>Select an option from the profile toolbar.</p>
          </div>
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
        <div className="profile-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Profile;
