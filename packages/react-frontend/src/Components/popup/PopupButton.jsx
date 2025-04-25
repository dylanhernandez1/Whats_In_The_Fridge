import React from "react";
import "./PopupButton.css";

const COLOR = ["green", "red"];

const PopupButton = ({ buttonColor, text, onClick }) => {
  const checkButtonColor = COLOR.includes(buttonColor)
    ? buttonColor
    : COLOR[0];

  return (
    <div
      className={`popup-button ${checkButtonColor}`}
      onClick={onClick}
    >
      <b>{text}</b>
    </div>
  );
};

export default PopupButton;
