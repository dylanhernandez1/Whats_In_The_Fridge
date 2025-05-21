import React, { useState, useEffect } from "react";
import "./Food_Styling.css";
import { useNavigate } from "react-router-dom";
import URL from "./Url";
let debounce = false;

function ForgotPasswordRequest() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document
      .getElementById("email-field")
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

  function SendPasswordRequest(){
    const verifyPromise = fetch(`${URL}/verify-email`, {
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

      navigate("/login", { state: { id: 4 }})

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
        <h2>Forgot Your Password?</h2>
      
        {error && <div className="invalid">{error}</div>}

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
          <button
            id="request-password-request"
            className="primary-button"
            onClick={SendPasswordRequest()}
          
          >
            Request Email Password Request
      
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordRequest;
