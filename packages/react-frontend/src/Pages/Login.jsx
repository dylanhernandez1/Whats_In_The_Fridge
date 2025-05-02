import React, { useState } from "react";
import "./Login_Styling.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function sendInformation() {
    try {
      const res = await fetch(`http://localhost:8000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log("Login successful!", data.token);

        //Save token to localStorage

        localStorage.setItem("token", data.token);
        // Navigate to home
        navigate("/");
      } else if (res.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Error. Try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Timed out. Try again.");
    }
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

        <p className="invalid">{error}</p>
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
          onClick={sendInformation}
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
