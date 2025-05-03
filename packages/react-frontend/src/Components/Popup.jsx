import React, { useState } from "react";
import ExitButton from "./popup/ExitButton.jsx";
import PopupHeader from "./popup/PopupHeader.jsx";
import InformationTag from "./popup/InformationTag.jsx";
import PopupFooter from "./popup/PopupFooter.jsx";
import Incrementor from "./popup/Incrementor.jsx";
import "./Popup.css";

function Popup({ foodInfo, onDelete, onClose }) {
  console.log(foodInfo);
  const [status, setStatus] = useState("popup-hidden");
  const [info, setInfo] = useState(undefined);
  const [size, setSize] = useState("start");

  /* If props.foodInfo being passed to Popup is undefined, means: 
       1) No card has been pressed yet, so don't display the popup

       Otherwise, if props.foodInfo is defined AND "status" is hidden (meaning there is no current popup activated)
       activate the popup and set the status accordingly
    */
  if (foodInfo === undefined && status !== "popup-hidden") {
    setStatus("popup-hidden");
    setInfo(undefined);
    setSize("start");
  } else if (
    status === "popup-hidden" &&
    foodInfo !== undefined
  ) {
    setInfo(foodInfo);
    setStatus("popup-active");
  }

  /* The function to be called to close the popup.
       Handles resetting the values to their original state 
       when foodInfo is set to undefined in Home.jsx */
  function onCloseClicked() {
    onClose();
  }

  function onUpdateQtyClicked() {
    if (size === "expanded") {
      setSize("original");
    } else {
      setSize("expanded");
    }
  }

  function onDeleteClicked() {
    onDelete(info._id);
  }

  return (
    <div className={status}>
      <div className={`popup-frame-${size}`}>
        <div className="popup-frame-clip">
          <ExitButton onClick={onCloseClicked} />
          <PopupHeader
            foodName={info ? info.FoodName : ""}
            expirationDate={info ? info.ExpirationDate : 0}
          />
          <InformationTag
            tagIcon={info ? info.Location : "Fridge"}
            tagInfo={info ? info.Location : ""}
          />
          <InformationTag
            tagIcon={info ? info.FoodType : "Fruit"}
            tagInfo={info ? info.FoodType : ""}
          />
          <InformationTag
            tagIcon={info ? info.Amount : 0}
            tagInfo="Quantity"
          />
          <Incrementor
            size={size}
            quantity={info ? info.Amount : 0}
          />
          <PopupFooter
            onUpdateQty={onUpdateQtyClicked}
            onDelete={onDeleteClicked}
          />
        </div>
      </div>
    </div>
  );
}

export default Popup;
