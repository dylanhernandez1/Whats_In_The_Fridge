// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, matchPath } from "react-router-dom";
import { routes } from "./Utils/Routes.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function MyApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const currentRoute = routes.find((route) =>
      matchPath(
        { path: route.path, end: true },
        location.pathname
      )
    );

    if (currentRoute.protected && !token) {
      navigate("/login");
    } else if (currentRoute.protected && token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          navigate("/login"); // Token is expired
        }
      } catch (e) {
        navigate("/login"); // Token is malformed
      }
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
