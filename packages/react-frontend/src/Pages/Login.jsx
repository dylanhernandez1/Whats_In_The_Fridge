import React, { useState } from "react";
import "./Food_Styling.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function getUserFromDatabase() {
    const promise = fetch("http://localhost:8000/users?=", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        if (res.status == 200) {
          const data = await res.json();
          //REROUTE TO HOME PAGE
          setError("");
          console.log("Successful add");
        } else if (res.status == 400) {
          console.log("400 error");
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
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
          placeholder="Email "
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
          onClick={() => getUserFromDatabase()}
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
