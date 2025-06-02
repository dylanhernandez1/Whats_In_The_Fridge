// src/Table.jsx
import React, { useEffect, useState } from "react";
import Toolbar from "../Components/Toolbar.jsx";
import { useNavigate } from "react-router-dom";
import "../Components/Profile_page.css";
import ProfileToolbar from "../Components/profile_bar.jsx";
import { FaSignOutAlt } from "react-icons/fa";
import URL from "./Url";

function Profile() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] =
    useState("User");
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [newHouse, setNewHouse] = useState({
    houseName: "",
    state: "",
    country: "",
    town: ""
  });
  const [userData, setUserData] = useState(null);
  const [userHouses, setHouses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        // Get user info
        const userRes = await fetch(`${URL}/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!userRes.ok)
          throw new Error(
            `Failed user fetch: ${userRes.statusText}`
          );
        const userInfo = await userRes.json();
        setUserData(userInfo);

        // Get houses
        const housesData = await getHouses(token);
        setHouses(housesData.housesByUser);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        navigate("/login");
      }
    }

    fetchData();
  }, []);

  async function getHouses(token) {
    if (!token) return [];
    try {
      const res = await fetch(`${URL}/userhouses`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message =
          errorData?.error || `HTTP ${res.status}`;
        console.error("Error from /userhouses:", message);
        navigate("/login");
        return [];
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching houses:", err);
      return [];
    }
  }

  function getMembershipDuration(createdAt) {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - createdDate.getFullYear()) * 12 +
      (now.getMonth() - createdDate.getMonth());
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
  }

  function LogOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function handleDeleteAccount() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${URL}/currentUser`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Your account has been deleted.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        const errorData = await res.json().catch(() => null);
        const message =
          errorData?.error || `HTTP ${res.status}`;
        alert("Error deleting account: " + message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Unexpected error occurred.");
    }
  }

  function manageHouses() {
    setShowHouseModal(true);
  }

  async function sendHouse() {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${URL}/house-invitation/:houseId/users/:userId/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            email: "cameron.ung0@gmail.com", //REPLACE THESE
            houseId: "6828e37d2f2e9a33a5adb318" //TO PASSED IN THING
          })
        }
      );
    } catch (error) {
      alert("Network or unexpected error: " + error.message);
    }
  }

  async function submitHouse() {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${URL}/houses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...newHouse })
      });

      console.log(
        "Request body:",
        JSON.stringify({ ...newHouse })
      );

      if (res.ok) {
        alert("House created!");
        setShowHouseModal(false);
        setNewHouse({
          houseName: "",
          state: "",
          country: "",
          town: ""
        });
      } else {
        const rawText = await res.text();
        let errorMessage;

        try {
          const errorJson = JSON.parse(rawText);
          errorMessage =
            errorJson.message || JSON.stringify(errorJson);
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
    if (!userData) {
      return (
        <div className="profile-content">
          <p>Loading user data...</p>
        </div>
      );
    }
    switch (selectedSection) {
      case "User":
        return (
          <div className="profile-content">
            <div className="user-header">
              <img
                src={userData?.profileImage}
                alt="Profile"
                className="profile-picture"
              />
              <div className="user-info">
                <h2>{userData?.name || "Loading..."}</h2>
                <p>
                  Member for{" "}
                  {userData?.createdAt
                    ? getMembershipDuration(userData.createdAt)
                    : "Loading..."}
                </p>
              </div>
            </div>
            {/* User details table/list below the header */}
            <div className="user-details"></div>
            <p>
              <strong>Name:</strong> {userData?.name}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email}
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
                onClick={sendHouse}
              >
                + Temp Send House Request
              </button>
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
              <button
                className="delete-account"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        );
      case "Houses":
        return (
          <div className="profile-content">
            <h3>Your Houses</h3>
            {userHouses.length === 0 ? (
              <p>No houses found.</p>
            ) : (
              userHouses.map((userHouse) => (
                <div
                  key={userHouse.house._id}
                  className="house-entry"
                >
                  <p>
                    <strong>Name:</strong>{" "}
                    {userHouse.house.houseName}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {userHouse.house.town},{" "}
                    {userHouse.house.state},{" "}
                    {userHouse.house.country}
                  </p>
                  <p>
                    <strong>Role:</strong> {userHouse.role}
                  </p>
                </div>
              ))
            )}
          </div>
        );
      case "Other Settings":
        return (
          <div className="profile-content">
            <h3>Preferences</h3>
            <p>
              <strong>Notifications:</strong>{" "}
              {userData?.preferences?.notifications
                ? "Enabled"
                : "Disabled"}
            </p>
            <p>
              <strong>Language:</strong>{" "}
              {userData?.preferences?.language ||
                "English (US)"}
            </p>
            <p>
              <strong>Theme:</strong>{" "}
              {userData?.preferences?.theme || "Light"}
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
                onChange={(e) =>
                  setNewHouse({
                    ...newHouse,
                    houseName: e.target.value
                  })
                }
              />
              <input
                type="text"
                placeholder="Town"
                value={newHouse.town}
                onChange={(e) =>
                  setNewHouse({
                    ...newHouse,
                    town: e.target.value
                  })
                }
              />
              <input
                type="text"
                placeholder="State"
                value={newHouse.state}
                onChange={(e) =>
                  setNewHouse({
                    ...newHouse,
                    state: e.target.value
                  })
                }
              />
              <input
                type="text"
                placeholder="Country"
                value={newHouse.country}
                onChange={(e) =>
                  setNewHouse({
                    ...newHouse,
                    country: e.target.value
                  })
                }
              />
              <div className="modal-buttons">
                <button onClick={submitHouse}>Create</button>
                <button
                  onClick={() => setShowHouseModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
