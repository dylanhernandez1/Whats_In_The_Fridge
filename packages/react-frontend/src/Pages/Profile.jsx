// src/Table.jsx
import React, { useEffect, useState } from "react";
import Toolbar from "../Components/Toolbar.jsx";
import { useNavigate } from "react-router-dom";
import "../Components/Profile_page.css";
import ProfileToolbar from "../Components/profile_bar.jsx";
import { FaSignOutAlt } from "react-icons/fa";
import URL from "./Url";
import defaultProfileImage from "../assets/default-profile.png";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    profileImageFile: "",
    profileImagePreview: ""
  });
  const [defaultHouseId, setDefaultHouseId] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteHouseId, setInviteHouseId] = useState(null);

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
        if (housesData.defaultHouse) {
          setDefaultHouseId(housesData.defaultHouse._id);
        } else {
          setDefaultHouseId(
            housesData.housesByUser[0]?.house._id
          );
        }
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
    if (!inviteHouseId || !inviteEmail)
      return alert("Missing data");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${URL}/house-invitation/${inviteHouseId}/users/${inviteEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const responseText = await res.text();

      if (res.ok) {
        alert("Invitation sent successfully!");
        setShowInviteModal(false);
        setInviteEmail("");
        setInviteHouseId(null);
      } else {
        alert(`Failed to send invitation: ${responseText}`);
      }
    } catch (error) {
      alert("Network or unexpected error: " + error.message);
    }
  }

  async function setDefaultHouse(houseId) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${URL}/defaultHouse/${houseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        alert("Set Default House successfully!");
      } else {
        const data = await res.json().catch(() => ({}));
        const message =
          data.message || "Unknown error occurred";
        alert(`Failed to set default house: ${message}`);
      }
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

  function handleEditToggle() {
    setEditedUser({
      name: userData.name,
      email: userData.email,
      profileImagePreview:
        userData?.profileImage || defaultProfileImage
    });
    setIsEditing(!isEditing);
  }

  async function handleSave() {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("name", editedUser.name);
    formData.append("email", editedUser.email);
    if (editedUser.profileImageFile) {
      formData.append(
        "profileImage",
        editedUser.profileImageFile
      );
    }

    try {
      const res = await fetch(`${URL}/currentUser`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        let errorMessage = "Unknown error";

        const contentType = res.headers.get("content-type");
        if (
          contentType &&
          contentType.includes("application/json")
        ) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await res.text(); // fallback if it's plain text
        }

        console.error("Error response:", errorMessage);
        alert(`Failed to update user info: ${errorMessage}`);
        return;
      } else {
        const data = await res.json();
        setUserData(data.user); // Use the `user` object from response
        setIsEditing(false);
        alert("User info updated successfully!");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Unexpected error.");
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
              {/* View mode */}
              {!isEditing ? (
                <>
                  <img
                    src={
                      userData?.profileImage ||
                      defaultProfileImage
                    }
                    alt="Profile"
                    className="profile-picture"
                  />
                  <div className="user-info">
                    <h2>{userData?.name || "Loading..."}</h2>
                    <p>
                      Member for{" "}
                      {userData?.createdAt
                        ? getMembershipDuration(
                            userData.createdAt
                          )
                        : "Loading..."}
                    </p>
                    <div className="user-details">
                      <p>
                        <strong>Name:</strong> {userData?.name}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {userData?.email}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                // Edit mode
                <>
                  <img
                    src={
                      editedUser?.profileImagePreview ||
                      editedUser?.profileImage ||
                      "../assets/default-profile.png"
                    }
                    alt="Profile Preview"
                    className="profile-picture"
                  />
                  <div className="user-info">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditedUser({
                              ...editedUser,
                              profileImagePreview:
                                reader.result,
                              profileImageFile: file
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          name: e.target.value
                        })
                      }
                    />
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          email: e.target.value
                        })
                      }
                    />
                  </div>
                </>
              )}

              <div style={{ marginLeft: "auto" }}>
                {isEditing ? (
                  <button
                    className="delete-account"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="delete-account"
                    onClick={handleEditToggle}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

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
              userHouses.map((userHouse) => {
                const isDefault =
                  defaultHouseId === userHouse.house._id;
                return (
                  <div
                    key={userHouse.house._id}
                    className="house-entry"
                  >
                    <p>
                      <strong>Name:</strong>{" "}
                      {userHouse.house.houseName}
                      {isDefault && <span>✔️</span>}
                      {!isDefault && (
                        <button
                          className="delete-account"
                          onClick={() =>
                            setDefaultHouse(userHouse.house._id)
                          }
                        >
                          Set as Default
                        </button>
                      )}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {userHouse.house.town},{" "}
                      {userHouse.house.state},{" "}
                      {userHouse.house.country}
                    </p>
                    <p>
                      <strong>Role:</strong> {userHouse.role}
                      {/* new house buttons to set default */}
                      {userHouse.role === "owner" && (
                        <div className="house-buttons">
                          <button
                            className="add-member-button"
                            onClick={() => {
                              setInviteHouseId(
                                userHouse.house._id
                              );
                              setShowInviteModal(true);
                            }}
                          >
                            Add Member
                          </button>
                        </div>
                      )}
                    </p>
                    <hr />
                  </div>
                );
              })
            )}
            <button
              className="add-house-button"
              onClick={manageHouses}
            >
              + Add House
            </button>
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
        {showInviteModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Invite User to House</h2>
              <input
                type="email"
                placeholder="Enter user email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <div className="modal-buttons">
                <button onClick={sendHouse}>
                  Send Invitation
                </button>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail("");
                    setInviteHouseId(null);
                  }}
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
