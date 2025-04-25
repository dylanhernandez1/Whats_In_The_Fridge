import React from "react";
import FruitWhite from "../../Assets/FruitWhite.png";
import VegetableWhite from "../../Assets/FruitWhite.png";
import DairyWhite from "../../Assets/DairyWhite.png";
import ProteinWhite from "../../Assets/ProteinWhite.png";
import FatsAndOilsWhite from "../../Assets/Fats & OilsWhite.png";
import GrainsWhite from "../../Assets/GrainsWhite.png";
import SugarsAndSweetsWhite from "../../Assets/Sugars & SweetsWhite.png";
import DrinksWhite from "../../Assets/DrinksWhite.png";
import Fridge from "../../Assets/Fridge.png";
import Freezer from "../../Assets/Freezer.png";
import Pantry from "../../Assets/Pantry.png";
import "./InformationTag.css";

const Icons = {
  Fruit: FruitWhite,
  Vegetable: VegetableWhite,
  Dairy: DairyWhite,
  Protein: ProteinWhite,
  Grains: GrainsWhite,
  "Fats & Oils": FatsAndOilsWhite,
  "Sugars & Sweets": SugarsAndSweetsWhite,
  Drinks: DrinksWhite,
  Fridge: Fridge,
  Freezer: Freezer,
  Pantry: Pantry
};

/* iconInfo can be passed in two different ways:
    1) if it's a string, means it references an image path for the icon
    2) if it's an int, the icon will sipmply be the int
*/
function InformationTag({ tagIcon, tagInfo }) {
  if (typeof tagIcon === "string") {
    return (
      <div className="information-tag-container">
        <img
          className="information-tag-icon"
          src={Icons[tagInfo]}
        ></img>
        <div className="information-tag-info">{tagInfo}</div>
      </div>
    );
  } else {
    return (
      <div className="information-tag-container">
        <div className="information-tag-icon">
          <b>{tagIcon}</b>
        </div>
        <div className="information-tag-info">{tagInfo}</div>
      </div>
    );
  }
}

export default InformationTag;
