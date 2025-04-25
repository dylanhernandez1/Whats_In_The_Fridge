import React, { useState } from "react";
import ExitButton from "./popup/ExitButton.jsx";
import PopupHeader from "./popup/PopupHeader.jsx";
import InformationTag from "./popup/InformationTag.jsx";
import PopupFooter from "./popup/PopupFooter.jsx";

import Fruit from "../Assets/Fruit.png";
import Vegetable from "../Assets/Fruit.png";
import Dairy from "../Assets/Dairy.png";
import Protein from "../Assets/Protein.png";
import FatsAndOils from "../Assets/Fats & Oils.png";
import Grains from "../Assets/Grains.png";
import SugarsAndSweets from "../Assets/Sugars & Sweets.png";
import Drinks from "../Assets/Drinks.png";
import SideDecor from "../Assets/PopupSideDecoration.png";
import "./Popup.css";

const Icons = {
  'Fruit': Fruit,
  'Vegetable': Vegetable,
  'Dairy': Dairy,
  'Protein': Protein,
  'Grains': Grains,
  "Fats & Oils": FatsAndOils,
  "Sugars & Sweets": SugarsAndSweets,
  'Drinks': Drinks
};

function Popup({ foodInfo }) {
  const [status, setStatus] = useState("popup-hidden");
  const [info, setInfo] = useState(undefined);
  const [size, setSize] = useState("start");

  /* If props.foodInfo being passed to Popup is undefined, means: 
       1) No card has been pressed yet, so don't display the popup

       Otherwise, if props.foodInfo is defined AND "status" is hidden (meaning there is no current popup activated)
       activate the popup and set the status accordingly
    */
  if (foodInfo === undefined && status !== "popup-hidden") {
    console.log("setting hidden");
    setStatus("popup-hidden");
  } else if (
    status === "popup-hidden" &&
    foodInfo !== undefined
  ) {
    console.log("setting active");
    setInfo(foodInfo);
    setStatus("popup-active");
  }

  /* The function to be called to close the popup.
       Handles resetting the values to their original state */
  function onClose() {
    console.log("closed");
  }

  function onUpdateQty() {

  }

  function onDelete() {

  }

  return (
    <div className={status}>
      <div className={`popup-frame-${size}`}>
        <img className="popup-frame-icon" src={Icons[info ? info.FoodType : "Fruit"]}></img>
        <div className="popup-frame-clip">
            <img className="popup-frame-decor" src={SideDecor}></img>
            <ExitButton onClick={onClose} />
            <PopupHeader foodName={info ? info.FoodName : ""} expirationDate={info ? info.ExpirationDate : 0}/>
            <InformationTag tagIcon={info ? info.Amount : 0} tagInfo={info ? info.Location : ""}/>
            <InformationTag tagIcon={info ? info.FoodType : "Fruit"} tagInfo={info ? info.FoodType : ""}/>
            <InformationTag tagIcon={info ? info.Amount : 0} tagInfo="Quantity"/>
            <PopupFooter onUpdateQty={onUpdateQty} onDelete={onDelete}/>
        </div>
      </div>
    </div>
  );
}

export default Popup;
