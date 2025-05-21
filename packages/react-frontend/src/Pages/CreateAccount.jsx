import React, { useState, useEffect } from "react";
import "./Food_Styling.css";
import { useNavigate } from "react-router-dom";
import URL from "./Url";
let debounce = false;

function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [addButtonText, setButtonText] =
    useState("Create Account");

  useEffect(() => {
    document
      .getElementById("password-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter" && debounce == false) {
          debounce = true;
          document.getElementById("create-account").click();

          setTimeout(() => {
            debounce = false;
          }, 300);
        }
      });
    document
      .getElementById("email-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          document.getElementById("password-field").focus();
          return;
        }
      });

    document
      .getElementById("username-field")
      .addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          document.getElementById("email-field").focus();
          return;
        }
      });
  });

  function Validation() {
    const EmailValidation = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (name.length < 3)
      return { bool: false, error: "Username Required" };
    if (!EmailValidation(email))
      return { bool: false, error: "Invalid Email" };
    if (password.length < 6)
      return {
        bool: false,
        error: "Password Must Be At Least 6 Characters"
      };
    return true;
  }

  function sendEmailVerification() {
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
  }

  function addUserToDatabase() {
    const result = Validation();
    if (result.bool == false) {
      setButtonText(result.error);
      setTimeout(() => {
        setButtonText("Create Account");
      }, 3000);
      return false;
    }

    const createPromise = fetch(`${URL}/users`, {
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
          sendEmailVerification();
          navigate("/login", {
            state: {
              id: "Email has been sent. Check your inbox or spam."
            }
          });
          console.log("Successful add");
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
        <h2>Welcome!</h2>

        <p className="info-blurb">
          Join us today to manage your fridge, pantry, and
          freezer! With an account, you'll be able to track your
          food, get recipe suggestions, and create grocery
          lists. It's easy and free!
        </p>
        {error && <div className="invalid">{error}</div>}

        <div>
          <label htmlFor="name">Username</label>
          <input
            id="username-field"
            className="input-field"
            placeholder="Enter your username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
          <label htmlFor="password">Password</label>
          <input
            id="password-field"
            className="input-field"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button
            id="create-account"
            className="primary-button"
            onClick={addUserToDatabase}
          >
            {addButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountPage;

//  -- FILE: packages/react-frontend/src/Pages/CreateAccount.jsx
// Feature: Sign up

//   Rule: Account is created or not created
//
//   Given: A valid username, email and password
//          Then: An account will be created and saved into the database
//   But: An if using an invalid username, email, or password
//          Then: No account will be created and will display an error
//   When: Pressing create an account, the information from the fields will be
//         picked and sent into the backend to be saved.
//   Background: Given a user named "Trash" with username: hello, password: somemaydie, email: itryhard@gmail.com
//   Scenario: Trash created an account with the information above
//             Given I am not Trash
//             When I try to create an account with the information above
//             Then the system will refuse to create an account with that information.
//   Scenario: Trash has not yet made the account
//             Given I am not Trash
//             When I try to create an account with the information above
//             Then the system will create the account and Trash has to use different information
//   Scenario: Trash has not yet made the account and will make the account
//             Given they are Trash
//             When they try to create an account with the information above
//             Then the system will create the account for Trash
