import React from "react";
import "./Food_Styling.css";

function CreateAccountPage() {
  return (
    <div className="container">
      <label htmlFor="name">Welcome</label>

      <label htmlFor="name">What's In The Fridge?</label>
      <label htmlFor="name">Register</label>

      <div>
        <input
          style={{
            fontStretch: "ultra-condensed",
            color: "grey"
          }}
          placeholder="Email"
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
        <button //HERE IS WHERE WE WILL SAVE THE DATA TO THE DATABASE
          className="add-button"
          style={{
            fontStretch: "ultra-condensed",
            color: "black"
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default CreateAccountPage;
