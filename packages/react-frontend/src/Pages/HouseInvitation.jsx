import React, { useState, useEffect } from "react";
import "./Food_Styling.css";
import { useNavigate, useParams } from "react-router-dom";
import URL from "./Url";
let debounce = false;

function HouseInvitation() {
  const navigate = useNavigate();
  const { token, houseId, userId } = useParams();

  useEffect(() => {
    const sendInvitation = async () => {
      try {
        const res = await fetch(
          `${URL}/houses/${houseId}/users/${userId}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );
        navigate("/");
      } catch (error) {
        alert("Network or unexpected error: " + error.message);
      }
    };
    sendInvitation();
  });

  return 0;
}

export default HouseInvitation;
