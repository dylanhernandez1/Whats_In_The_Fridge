import React, { useState, useEffect } from "react";
import "./Food_Styling.css";
import { useNavigate } from "react-router-dom";
import URL from "./Url";

function VerifyEmailPage() {
  useEffect(() => {
    console.log("Something is happeneing here for some reason");
    const promise = fetch(`${URL}/verify-email/:id`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        if (res.status == 201) {
          //REROUTE TO HOME PAGE
          console.log("Successfuly sent");
        } else if (res.status == 400) {
          const message = await res.text();
          setError(message);
          console.log("400 error: " + message);
        } else if (res.status == 409) {
          const message = await res.text();
          setError(message);
          console.log("409 error: " + message);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  });

  return (
    <div className="login-container">
      <div className="logo">What's In The Fridge?</div>
    </div>
  );
}

export default VerifyEmailPage;
