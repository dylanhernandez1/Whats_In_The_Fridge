// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./Utils/Routes.jsx";

function MyApp() {
  function fetchFood(text) {
    const promise = fetch(
      `http://localhost:8000/food/stored-food/${text}`
    );
    return promise;
  }

  //Return application format (http) with Table and Form and parameters

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route
          path={path}
          element={
            element()
            // At some point "allProps" needs to be filtered out to only the selected props wanted
          }
        />
      ))}
    </Routes>
  );
}

export default MyApp;
