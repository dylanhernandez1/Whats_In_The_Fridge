import React, { useState, useEffect } from "react";
import "./Login_Styling.css";
import { useLocation, useNavigate } from "react-router-dom";
const URL = "localhost:8000";
let debounce = false;

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document
      .getElementById("email-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          document.getElementById("password-field").focus();
          return;
        }
      });

    document
      .getElementById("password-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter" && debounce == false) {
          debounce = true;
          document.getElementById("sign-in").click();

          setTimeout(() => {
            debounce = false;
          }, 300);
        }
      });
  });

  useEffect(() => {
    if (
      location.state !== undefined &&
      location.state !== null
    ) {
      if (location.state.id === 1) {
        setError(
          "Email has been sent. Check your inbox or spam."
        );
      } else if (location.state.id === 2) {
        setError("Email has been verified.");
      } else if (location.state.id === 3) {
        setError("Token invalid. Please retry.");
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  async function sendInformation() {
    try {
      const res = await fetch(`http://${URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      console.log(res.status);
      if (res.status === 200) {
        const data = await res.json();
        console.log("Login successful!", data.token);
        //Save token to localStorage

        localStorage.setItem("token", data.token);
        // Navigate to home
        navigate("/");
      } else if (res.status === 401) {
        setError("Invalid email or password.");
      } else if (res.status === 402) {
        setError("Email not verified.");
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
          id="email-field"
          className="input-field"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          id="password-field"
          className="input-field"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          id="sign-in"
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

export default Login;
