import React, { useState } from "react";
// import "./Food_Styling.css";
import "./Login_Styling.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function SendInformation() {
    const promise = fetch(`http://localhost:8000/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
  }

  function getUserFromDatabase() {
    const promise = fetch(
      `http://localhost:8000/users/?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(async (res) => {
        if (res.status == 200) {
          console.log("Found");
          SendInformation();
        } else if (res.status == 404) {
          console.log("400 error");
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }

  return (
    <div className="login-container">
      <div className="logo">What's In The Fridge?</div>

      <div className="login-card">
        <h2>Welcome Back!</h2>

        <p className="info-blurb">
          Thanks for using What’s in the Fridge! Ready to track
          your food, find new recipes, and stay organized? Log
          in to pick up where you left off, or create an account
          to get started!
        </p>

        <input
          className="input-field"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="primary-button"
          onClick={getUserFromDatabase}
        >
          Sign In
        </button>

        <button className="link-button">
          Forgot Password?
        </button>

        <div className="new-user-section">
          <p>New to What's In The Fridge?</p>
          <button
            className="primary-button"
            onClick={() => navigate("/create-account")}
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
