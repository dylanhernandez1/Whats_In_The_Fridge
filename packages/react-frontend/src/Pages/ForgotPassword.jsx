import React, { useState, useEffect } from "react";
import "./Food_Styling.css";
import { useNavigate } from "react-router-dom";
import URL from "./Url";
let debounce = false;

function ForgotPasswordRequest() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document
      .getElementById("confirm-password-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter" && debounce == false) {
          debounce = true;
          document.getElementById("request-password-request").click();

          setTimeout(() => {
            debounce = false;
          }, 300);
        }
      });
  });


  return (
    <div className="login-container">
      <div className="logo">What's In The Fridge?</div>
      <button
        className="back-button"
        onClick={() => navigate("/login")}
      >
        {"<"}
      </button>

      <div className="login-card">
        <h2>Set a new password</h2>
      
        {error && <div className="invalid">{error}</div>}

        <div>
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password-field"
            className="input-field"
            placeholder="Enter a new password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password-field"
            className="input-field"
            placeholder="Confirm your password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <div>
          <button
            id="request-password-request"
            className="primary-button"
            onClick={()=> navigate("/login", { state: { id: 5 } })
          }
          >
            Change Password
      
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordRequest;
