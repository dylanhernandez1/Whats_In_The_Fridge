// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./Utils/Routes.jsx";

function MyApp() {
  //Use empty state
  const [characters, setCharacters] = useState([]);

  function updateList(person) {
    //Update list logic (postUser to backend and wait for promise)
    postUser(person)
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        } else {
          throw new Error(`Received code ${res.status}`);
        }
      })
      .then((json) => setCharacters([...characters, json])) //Actually updates the lsit here
      .catch((error) => {
        console.log(error); //Error handling
      });
  }

  function removeOneCharacter(index) {
    //Make promise to backend to remove character if found
    let id = characters[index]._id;
    fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (res.status === 204) {
          //Only remove if character is found and successfully deleted
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        } else {
          throw new error(`Received code ${res.status}`);
        }
      })
      .catch((error) => console.log(error));
  }

  function fetchUsers() {
    //Get users (with promise to run async)
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    //Add a user to backend logic
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });

    return promise;
  }

  function fetchFood(text) {
    const promise = fetch(
      `http://localhost:8000/food/stored-food/${text}`
    );
    return promise;
  }

  //Return application format (http) with Table and Form and parameters
  const allProps = {
    characters,
    removeCharacter: removeOneCharacter,
    updateList
  };

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route
          path={path}
          element={element(
            // At some point "allProps" needs to be filtered out to only the selected props wanted
            allProps
          )}
        />
      ))}
    </Routes>
  );
}

export default MyApp;
