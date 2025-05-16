import React, { useState, useEffect } from "react";
import "./Food_Styling.css";
import { useNavigate, useParams } from "react-router-dom";
import URL from "./Url";

function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Wer");
    const promise = fetch(`${URL}/verify-email/${token}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        console.log(res);
        if (res.status === 200) {
          navigate("/login", { state: { id: 2 } });

          console.log("Successfuly sent");
        } else {
          navigate("/login", { state: { id: 3 } });
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, [token]);

  return (
    <div className="login-container">
      <div className="logo">What's In The Fridge?</div>
    </div>
  );
}

export default VerifyEmailPage;
