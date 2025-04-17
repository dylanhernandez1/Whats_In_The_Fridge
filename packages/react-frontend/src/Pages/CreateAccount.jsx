import React from "react";
import "./Food_Styling.css";

function CreateAccountPage() {
  function addUserToDatabase() {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then((res) => {
        if (res.status == 201) {
        } else {
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
          onClick={addUserToDatabase}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default CreateAccountPage;
