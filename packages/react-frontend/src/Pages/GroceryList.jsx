import React from "react";
import Toolbar from "../Components/Toolbar";
const URL =
  "whats-in-the-fridge-e2f8g5etfbarcmdk.westus-01.azurewebsites.net";

function GroceryList() {
  return (
    <div className="container">
      <Toolbar selected="Groceries" />

      <label htmlFor="name">My Groceries</label>
    </div>
  );
}

export default GroceryList;
