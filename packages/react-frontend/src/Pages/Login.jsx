import React, { useState, useEffect } from "react";
import "./Login_Styling.css";
import { useLocation, useNavigate } from "react-router-dom";
import URL from "./Url";
let debounce = false;

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function sendEmailVerification() {
    const verifyPromise = fetch(`${URL}/verify-email`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    })
      .then(async (res) => {
        if (res.status == 201) {
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
      setError(location.state.id);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  async function sendInformation() {
    try {
      const res = await fetch(`${URL}/login`, {
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
      } else if (res.status === 403) {
        sendEmailVerification();
        setError("Email not verified.");
      } else {
        console.error("Error during login:", error);
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

        <button
          className="link-button"
          onClick={() => navigate("/forgot-password")}
        >
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
