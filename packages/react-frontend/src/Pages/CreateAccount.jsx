import React, { useState } from "react";
import "./Food_Styling.css";

function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [addButtonText, setButtonText] =
    useState("Create Account");

  function Validation() {
    const EmailValidation = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (name.length < 3) return false;
    if (!EmailValidation(email)) return false;
    if (password.length < 3) return false;

    return true;
  }

  function addUserToDatabase() {
    if (Validation() == false) {
      setButtonText("Invalid Information");
      setTimeout(() => {
        setButtonText("Create Account");
      }, 3000);
      return false;
    }

    console.log(email);
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    })
      .then(async (res) => {
        if (res.status == 201) {
          //REROUTE TO HOME PAGE
          setError("");
          console.log("Successful add");
        } else if (res.status == 400) {
          const message = await res.text();
          setError(message);
          console.log("400 error: " + message);
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
        <label htmlFor="name">{error ? error : ""}</label>
      </div>

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
          type="password"
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
          {addButtonText}
        </button>
      </div>
    </div>
  );
}

export default CreateAccountPage;
