import React from "react";
import Fruit from "../Assets/FruitWhite.png";
import Vegetable from "../Assets/VegetableWhite.png";
import Dairy from "../Assets/DairyWhite.png";
import Protein from "../Assets/ProteinWhite.png";
import FatsAndOils from "../Assets/Fats & OilsWhite.png";
import Grains from "../Assets/GrainsWhite.png";
import SugarsAndSweets from "../Assets/Sugars & SweetsWhite.png";
import Drinks from "../Assets/DrinksWhite.png";
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
