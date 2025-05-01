import React, { useState } from "react";
import "./Incrementor.css";

function Incrementor({ size, quantity }) {
  const [increment, setIncrement] = useState(quantity);

  /* Determines if increment should go up/down */
  function onChange(changeType) {
    if (changeType === "+") {
        console.log("+")
    } else {
        console.log("-")
    }
  }

  return (
    <div className={`incrementor-frame-${size}`}>
      <div 
        className={"incrementor-button"}
        onClick={() => onChange("-")}>
        <b>-</b>
      </div>
      <div className={"incrementor-button"}>
        <b>{increment}</b>
      </div>
      <div 
        className={"incrementor-button"}
        onClick={() => onChange("+")}
      >
        <b>+</b>
      </div>
      <div className={`increment-save-${increment === quantity ? "hide" : "active"}`}>
      </div>
    </div>
  );
}

export default Incrementor;
