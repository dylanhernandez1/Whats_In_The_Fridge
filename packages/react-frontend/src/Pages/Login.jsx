import React, { useState } from "react";
import "./Food_Styling.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        const data = await res.json(); // assuming you send { token: '...' } back
        console.log("Login successful!", data.token);

        // Optionally, save token to localStorage/sessionStorage
        localStorage.setItem("token", data.token);

        // Navigate to home or dashboard
        navigate("/");
      } else if (res.status === 401) {
        alert("Invalid email or password!");
      } else {
        alert("Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Server error. Please try again later.");
    }
  }

  return (
    <div className="container">
      <label htmlFor="name">Welcome</label>

      <label htmlFor="name">What's In The Fridge?</label>
      <label htmlFor="name">Login?</label>

      <div>
        <input
          style={{
            fontStretch: "ultra-condensed",
            color: "grey"
          }}
          placeholder="Email"
          type="string"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          style={{
            fontStretch: "ultra-condensed",
            color: "grey"
          }}
          placeholder="Password"
          type="string"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <button
          className="add-button"
          style={{
            fontStretch: "ultra-condensed",
            color: "black"
          }}
          onClick={sendInformation}
        >
          Sign In
        </button>
      </div>

      <div>
        <button
          className="add-button"
          style={{
            fontStretch: "ultra-condensed",
            color: "lightblue"
          }}
        >
          Forgot Password
        </button>
      </div>

      <div>
        <label>New to What's In The Fridge?</label>

        <button
          className="add-button"
          style={{
            fontStretch: "ultra-condensed",
            color: "lightblue"
          }}
          onClick={() => navigate("/create-account")}
        >
          Join now
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
