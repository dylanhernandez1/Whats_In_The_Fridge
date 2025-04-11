import "./profile_bar.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaUtensils,
  FaBook
} from "react-icons/fa";

// change
function ProfileToolbar({ onSelectSection, selectedSection }) {
  const navigate = useNavigate();

  const getButtonClass = (section) =>
    section === selectedSection
      ? "toolbar-button selected"
      : "toolbar-button";

  // account details
  function navToAccountDetails() {
    navigate("/profile");
  }

  // manage households
  function navToHouseholds() {
    navigate("/grocery-list");
  }

  // website settings
  function navToSettings() {
    navigate("/");
  }

  //Full table
  return (
    <div className="profileToolbar">
      <button
        className={getButtonClass("User")}
        onClick={() => onSelectSection("User")}
      >
        <span className="profile-button-text">User</span>
      </button>
      <button
        className={getButtonClass("Houses")}
        onClick={() => onSelectSection("Houses")}
      >
        <span className="profile-button-text">Houses</span>
      </button>
      <button
        className={getButtonClass("Other Settings")}
        onClick={() => onSelectSection("Other Settings")}
      >
        <span className="profile-button-text">
          Other Settings
        </span>
      </button>
    </div>
  );
}

export default ProfileToolbar;
