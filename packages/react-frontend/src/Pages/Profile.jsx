// src/Table.jsx
import React, { useEffect, useState } from "react";
import Toolbar from "../Components/Toolbar.jsx";
import { useNavigate } from "react-router-dom";
import "../Components/Profile_page.css";
import ProfileToolbar from "../Components/profile_bar.jsx";
import { FaSignOutAlt } from "react-icons/fa";
const URL =
  "whats-in-the-fridge-e2f8g5etfbarcmdk.westus-01.azurewebsites.net";

function Profile() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] =
    useState("User");
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [newHouse, setNewHouse] = useState({
    houseName: "",
    state: "",
    country: "",
    town: "",
  });
    

  function LogOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function manageHouses() {
    setShowHouseModal(true);
  }

  async function submitHouse() {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`https://${URL}/houses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...newHouse })
      });
  
      console.log("Request body:", JSON.stringify({ ...newHouse }));
  
      if (res.ok) {
        alert("House created!");
        setShowHouseModal(false);
        setNewHouse({ houseName: "", state: "", country: "", town: "" });
      } else {
        const rawText = await res.text();
        let errorMessage;
  
        try {
          const errorJson = JSON.parse(rawText);
          errorMessage = errorJson.message || JSON.stringify(errorJson);
        } catch {
          errorMessage = `Server error ${res.status}: ${rawText}`;
        }
  
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      alert("Network or unexpected error: " + error.message);
    }
  }  

  //Renders content based on the Profile Toolbar selection
  function renderContent() {
    switch (selectedSection) {
      case "User":
        return (
          <div className="profile-content">
            <div className="user-header">
              <img
                src="https://media.istockphoto.com/id/1447126543/photo/father-bonding-kiss-and-boy-child-hug-happy-in-nature-with-quality-time-together-outdoor.jpg?s=612x612&w=0&k=20&c=iujHdzYFrmfLgVLKcAzu4y1-awTR2xRo5m-rD9w35wU=" // ADD IMG HERE**
                alt="Profile"
                className="profile-picture"
              />
              <div className="user-info">
                <h2>John Doe</h2>
                <p>Member for 6 months</p>
              </div>
            </div>
            {/* User details table/list below the header */}
            <div className="user-details"></div>
            <p>
              <strong>Name:</strong> John Doe
            </p>
            <p>
              <strong>Email:</strong> john.doe@example.com
            </p>
            <p>
              <strong>Address:</strong> 1234 Main St,
              Springfield, USA
            </p>
            <p>
              <strong>Phone:</strong> (555) 123-4567
            </p>
            <p>
              <strong>Birthday:</strong> January 1, 1990
            </p>
            <div className="profile-buttons">
              <button
                className="add-house-button"
                onClick={manageHouses}
              >
                + Add House
              </button>
              <button
                className="log-out"
                onClick={() => LogOut()}
              >
                <FaSignOutAlt className="icon" />
                <span className="button-text">Sign Out</span>
              </button>
            </div>
          </div>
        );
      case "Houses":
        return (
          <div className="profile-content">
            <p>
              <strong>House 1:</strong> 12 Cherry Lane, San
              Diego, CA
            </p>
            <p>
              <strong>House 2:</strong> 98 Ocean View Rd,
              Monterey, CA
            </p>
            <p>
              <strong>House 3:</strong> 300 Pine St, Portland,
              OR
            </p>
          </div>
        );
      case "Other Settings":
        return (
          <div className="profile-content">
            <p>
              <strong>Notifications:</strong> Enabled
            </p>
            <p>
              <strong>Language:</strong> English (US)
            </p>
            <p>
              <strong>Theme:</strong> Light
            </p>
            <p>
              <strong>Account Status:</strong> Active
            </p>
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
        {showHouseModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Create a New House</h2>
      <input
        type="text"
        placeholder="House Name"
        value={newHouse.houseName}
        onChange={(e) => setNewHouse({ ...newHouse, houseName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Town"
        value={newHouse.town}
        onChange={(e) => setNewHouse({ ...newHouse, town: e.target.value })}
      />
      <input
        type="text"
        placeholder="State"
        value={newHouse.state}
        onChange={(e) => setNewHouse({ ...newHouse, state: e.target.value })}
      />
      <input
        type="text"
        placeholder="Country"
        value={newHouse.country}
        onChange={(e) => setNewHouse({ ...newHouse, country: e.target.value })}
      />
      <div className="modal-buttons">
        <button onClick={submitHouse}>Create</button>
        <button onClick={() => setShowHouseModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default Profile;
