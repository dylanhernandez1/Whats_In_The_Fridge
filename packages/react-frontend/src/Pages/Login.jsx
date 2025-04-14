import React from "react";
import "./Food_Styling.css";

function LoginPage() {
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
          placeholder="Username"
          type="string"
          onChange={(e) => setQuantity(e.target.value)}
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
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div>
        <button
          className="add-button"
          style={{
            fontStretch: "ultra-condensed",
            color: "black"
          }}
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
        >
          Join now
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
