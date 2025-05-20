import React from "react";
import Toolbar from "../Components/Toolbar";
import URL from "./Url";

function GroceryList() {
  return (
    <div className="container">
      <Toolbar selected="Groceries" />

      <label htmlFor="name">My Groceries</label>
    </div>
  );
}

export default GroceryList;
