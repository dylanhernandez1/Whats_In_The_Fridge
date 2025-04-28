import React from "react";
import Fruit from "../Assets/Fruit.png";
import Vegetable from "../Assets/Vegetable.png";
import Dairy from "../Assets/Dairy.png";
import Protein from "../Assets/Protein.png";
import FatsAndOils from "../Assets/Fats & Oils.png";
import Grains from "../Assets/Grains.png";
import SugarsAndSweets from "../Assets/Sugars & Sweets.png";
import Drinks from "../Assets/Drinks.png";
import SideDecor from "../Assets/PopupSideDecoration.png";
import "./IngredientButton.css";

const STYLE = ["color", "white"];
const ICONS = {
  Fruit: Fruit,
  Vegetable: Vegetable,
  Dairy: Dairy,
  Protein: Protein,
  Grains: Grains,
  "Fats & Oils": FatsAndOils,
  "Sugars & Sweets": SugarsAndSweets,
  Drinks: Drinks
};

const IngredientButton = ({ style, text, onClick }) => {
  const checkButtonStyle = STYLE.includes(style)
    ? style
    : STYLE[0];

  if (text === "All") {
    return (
      <div
        className={`ingredient-button-${checkButtonStyle}-all`}
        onClick={onClick}
      >
        <b>{text}</b>
      </div>
    );
  } else {
    return (
      <div
        className={`ingredient-button-${checkButtonStyle}`}
        onClick={onClick}
      >
        <b>{text}</b>
        <img
          className="ingredient-button-icon"
          src={ICONS[text] ? ICONS[text] : "Fruit"}
        ></img>
      </div>
    );
  }
};

export default IngredientButton;
