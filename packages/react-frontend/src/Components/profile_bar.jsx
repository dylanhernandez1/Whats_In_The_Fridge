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
function ProfileToolbar() {
  const navigate = useNavigate();

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
      <button onClick={navToAccountDetails}>
        <span className="profile-button-text">Home</span>
      </button>
      <button onClick={navToHouseholds}>
        <span className="profile-button-text">Food</span>
      </button>
      <button onClick={navToSettings}>
        <span className="profile-button-text">Groceries</span>
      </button>
      <button>
        <span className="profile-button-text">
          Whatever, not sure yet
        </span>
      </button>
      <button>
        <span className="profile-button-text">
          Other Settings
        </span>
      </button>
    </div>
  );
}

export default ProfileToolbar;
