// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import GroceryList from "./GroceryList";
import RecipeSuggester from "./RecipeSuggester";

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

  useEffect(() => {
    //React hook for updating list based on backend
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  //Return application format (http) with Table and Form and parameters
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            characters={characters}
            removeCharacter={removeOneCharacter}
            updateList={updateList}
          />
        }
      />
      <Route
        path="/profile"
        element={
          <Profile
            characters={characters}
            removeCharacter={removeOneCharacter}
            updateList={updateList}
          />
        }
      />
      <Route
        path="/grocery-list"
        element={
          <GroceryList
            characters={characters}
            removeCharacter={removeOneCharacter}
            updateList={updateList}
          />
        }
      />
      <Route
        path="/recipe-suggester"
        element={<RecipeSuggester />}
      />
    </Routes>
  );
}

export default MyApp;

/*
  return (
<Home characters={characters} removeCharacter={removeOneCharacter} updateList={updateList}/>


    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>

    <div className="container">
      <Routes>
        <Route path="/" element={
          <div>
        <Table characterData={characters} 
        removeCharacter={removeOneCharacter}/>
          <Form handleSubmit={updateList} />
          </div>
      }/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
 
    </div>
  );

*/
