import React from "react";
import "./IngredientButton.css";

const STYLE = ["color", "white"];

const IngredientButton = ({ style, text, onClick }) => {
  const checkButtonStyle = STYLE.includes(style)
    ? style
    : STYLE[0];

  return (
    <div
      className={`ingredient-button ${checkButtonStyle}`}
      onClick={onClick}
    >
      <b>{text}</b>
    </div>
  );
};

export default IngredientButton;