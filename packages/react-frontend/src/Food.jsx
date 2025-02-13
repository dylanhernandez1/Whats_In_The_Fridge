import React from "react";
import Toolbar from "./Toolbar";

function Food() {
  return (
    <div className="container">
      <Toolbar />

      <label htmlFor="name">Add Food</label>
    </div>
  );
}
 
export default Food;