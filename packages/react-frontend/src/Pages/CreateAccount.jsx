import React, { useState, useEffect } from "react";
import "./Food_Styling.css";
import { useNavigate } from "react-router-dom";
import URL from "./Url";
let debounce = false;

function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [addButtonText, setButtonText] =
    useState("Create Account");

  useEffect(() => {
    document
      .getElementById("password-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter" && debounce == false) {
          debounce = true;
          document.getElementById("create-account").click();

          setTimeout(() => {
            debounce = false;
          }, 300);
        }
      });
    document
      .getElementById("email-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          document.getElementById("password-field").focus();
          return;
        }
      });

    document
      .getElementById("username-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          document.getElementById("email-field").focus();
          return;
        }
      });
  });

  function Validation() {
    const EmailValidation = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (name.length < 3)
      return { bool: false, error: "Username Required" };
    if (!EmailValidation(email))
      return { bool: false, error: "Invalid Email" };
    if (password.length <= 3)
      return {
        bool: false,
        error: "Password Must Be More Than 3 Characters"
      };
    return true;
  }

  function addUserToDatabase() {
    const result = Validation();
    if (result.bool == false) {
      setButtonText(result.error);
      setTimeout(() => {
        setButtonText("Create Account");
      }, 3000);
      return false;
    }

    const promise = fetch(`${URL}/verify-email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email
      })
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
  }

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
        <h2>Welcome!</h2>

        <p className="info-blurb">
          Join us today to manage your fridge, pantry, and
          freezer! With an account, you'll be able to track your
          food, get recipe suggestions, and create grocery
          lists. It's easy and free!
        </p>

        <div>
          <label htmlFor="name">Username</label>
          <input
            id="username-field"
            className="input-field"
            placeholder="Enter your username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email-field"
            className="input-field"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password-field"
            className="input-field"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            id="create-account"
            className="primary-button"
            onClick={addUserToDatabase}
          >
            {addButtonText}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default CreateAccountPage;
