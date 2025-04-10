import React from "react";
import Toolbar from "../Components/Toolbar";

function GroceryList() {
  return (
    <div className="container">
      <Toolbar selected="Groceries" />

      <label htmlFor="name">My Groceries</label>
    </div>
  );
}

export default GroceryList;
