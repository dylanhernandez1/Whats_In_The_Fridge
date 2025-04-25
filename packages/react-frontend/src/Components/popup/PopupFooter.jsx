import React from "react";
import PopupButton from "./PopupButton.jsx";
import "./PopupFooter.css";

/* Handle the specific buttons that are found in the footer of the popup, being: 
    1) update quantity
    2) delete
   Button logic is handled in the footer
*/
function PopupFooter({ onUpdateQty, onDelete }) {
  function onUpdateClick() {
    onUpdateQty();
  }

  function onDeleteClick() {
    onDelete();
  }

  return (
    <div className="popup-footer-container">
      <PopupButton
        buttonColor="green"
        text="Update Qty"
        onClick={onUpdateClick}
      />
      <PopupButton
        buttonColor="red"
        text="Delete"
        onClick={onDeleteClick}
      />
    </div>
  );
}

export default PopupFooter;
