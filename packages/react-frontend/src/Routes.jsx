import React from "react";
import Home from "./Home";
import Profile from "./Profile";
import GroceryList from "./GroceryList";
import RecipeSuggester from "./RecipeSuggester";

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
  } // No props for now
];
