import React, { useState } from "react";
import ExitButton from "./popup/ExitButton.jsx";
import PopupFooter from "./popup/PopupFooter.jsx";
import "./Popup.css";

function ImagePopup({foodInfo, onDelete, onClose}) {
    const [status, setStatus] = useState("popup-hidden");
  const [info, setInfo] = useState(undefined);

  if (foodInfo === undefined && status !== "popup-hidden") {
    setStatus("popup-hidden");
    setInfo(undefined);
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

  function onSelectClicked() {
    onDelete(info._id);
  }

  return (
    <div className={status}>
      <div className={`popup-frame-start`}>
        <div className="popup-frame-clip">
          <ExitButton onClick={onCloseClicked} />
        </div>
      </div>
    </div>
  );
}

export default ImagePopup;