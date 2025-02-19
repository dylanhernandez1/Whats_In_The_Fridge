import React from "react";
import Home from "../Pages/Home.jsx";
import Profile from "../Pages/Profile.jsx";
import GroceryList from "../Pages/GroceryList.jsx";
import RecipeSuggester from "../Pages/RecipeSuggester.jsx";
import Food from "../Pages/Food.jsx";

export const routes = [
  {
    path: "/",
    element: (props) => <Home {...props} />,
    props: ["characters", "removeCharacter", "updateList"]
  },
  { path: "/profile", element: (props) => <Profile /> }, // No props for now
  {
    path: "/grocery-list",
    element: (props) => <GroceryList />
  }, // No props for now
  {
    path: "/recipe-suggester",
    element: (props) => <RecipeSuggester />
  }, // No props for now
  {
    path: "/food",
    element: (props) => <Food />
  } // No props for now
];
