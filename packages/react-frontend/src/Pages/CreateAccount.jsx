import React, { useState } from "react";
import "./Food_Styling.css";

function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function addUserToDatabase() {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Name: name,
        Email: email,
        Password: password
      })
    })
      .then((res) => {
        if (res.status == 201) {
          console.log("Successful add");
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
          placeholder="Username"
          type="string"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
