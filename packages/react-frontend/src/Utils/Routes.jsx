import React from "react";
import Home from "../Pages/Home.jsx";
import Profile from "../Pages/Profile.jsx";
import GroceryList from "../Pages/GroceryList.jsx";
import RecipeSuggester from "../Pages/RecipeSuggester.jsx";
import Food from "../Pages/Food.jsx";
import Login from "../Pages/Login.jsx";
import CreateAccount from "../Pages/CreateAccount.jsx";
import VerifyAccount from "../Pages/VerifyAccount.jsx";
import ForgotPassword from "../Pages/ForgotPassword.jsx"
import ForgotPasswordRequest from "../Pages/ForgotPasswordRequest.jsx"


export const routes = [
  {
    path: "/",
    element: (props) => <Home {...props} />,
    props: ["characters", "removeCharacter", "updateList"],
    protected: true
  },
  {
    path: "/profile",
    element: (props) => <Profile {...props} />,
    protected: true
  }, // No props for now
  {
    path: "/grocery-list",
    element: (props) => <GroceryList {...props} />,
    protected: true
  }, // No props for now
  {
    path: "/recipe-suggester",
    element: (props) => <RecipeSuggester {...props} />,
    protected: true
  }, // No props for now
  {
    path: "/food",
    element: (props) => <Food {...props} />,
    protected: true
  }, // No props for now
  {
    path: "/login",
    element: (props) => <Login {...props} />,
    protected: false
  }, // No props for now
  {
    path: "/create-account",
    element: (props) => <CreateAccount {...props} />,
    protected: false
  }, // No props for now
  {
    path: "/verify-email/:token",
    element: (props) => <VerifyAccount {...props} />,
    protected: false
  }, // No props for now
  {
    path: "/forgot-password",
    element: (props) => <ForgotPassword {...props} />,
    protected: false
  }, // No props for now
  {
    path: "/",
    element: (props) => <ForgotPasswordRequest {...props} />,
    protected: false
  }, // No props for now
];
