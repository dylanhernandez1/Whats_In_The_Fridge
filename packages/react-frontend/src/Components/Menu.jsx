import React, { useState } from "react";
import "./StyleSheet.css";
import { FaBars } from "react-icons/fa";

function Menu(props) {
  function FilterDropDown() {}

  return (
    <div className="">
      <button
        onClick={FilterDropDown}
        style={{ backgroundColor: "transparent", border: 0 }}
      >
        <FaBars className="icon" />
        <span className="button-text"></span>
      </button>
    </div>
  );
}

export default Menu;
