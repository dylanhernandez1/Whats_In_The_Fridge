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
        <FaHome className="icon" />
        <span className="button-text">Home</span>
      </button>
      <button onClick={navToHouseholds}>
        <FaUtensils className="icon" />
        <span className="button-text">Food</span>
      </button>
      <button onClick={navToSettings}>
        <FaShoppingCart className="icon" />
        <span className="button-text">Groceries</span>
      </button>
    </div>
  );
}

export default ProfileToolbar;
