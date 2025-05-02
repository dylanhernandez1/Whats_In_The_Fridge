// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./Utils/Routes.jsx";
import { useNavigate, useLocation } from "react-router-dom";

function MyApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const currentRoute = routes.find(
    (route) => route.path === location.pathname
  );

  useEffect(() => {
    if (currentRoute.protected && !token) {
      navigate("/login");
    }
  }, [navigate]);

  //Return application format (http) with Table and Form and parameters

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route
          key={path}
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
