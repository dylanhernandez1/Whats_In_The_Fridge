import React, { useState, useEffect } from "react";
import "./Food_Styling.css";
import { useNavigate, useParams } from "react-router-dom";
import URL from "./Url";
let debounce = false;

function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { token } = useParams();

  function ValidatePassword() {
    if (password.length < 6) {
      setError("Password Must Be At Least 6 Characters.");
      return false;
    } else if (password !== passwordConfirm) {
      setError("Passwords are not the same.");
      return false;
    }

    return true;
  }

  function SendPassword() {
    if (!ValidatePassword()) {
      return;
    }

    const promise = fetch(
      `${URL}/forgot-password-change/${token}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: password
        })
      }
    )
      .then(async (res) => {
        console.log(res);
        if (res.status === 201) {
          navigate("/login", {
            state: { id: "Password successfully changed." }
          });

          console.log("Successfuly sent");
        } else {
          navigate("/login", {
            state: {
              id: "Password could not be changed at this time. Please try again later."
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }

  useEffect(() => {
    document
      .getElementById("confirm-password-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter" && debounce == false) {
          debounce = true;
          document
            .getElementById("request-password-request")
            .click();

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
          <label htmlFor="confirm-password">
            Confirm Password
          </label>
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
            onClick={() => SendPassword()}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
