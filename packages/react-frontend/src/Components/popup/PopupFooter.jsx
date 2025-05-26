import React from "react";
import PopupButton from "./PopupButton.jsx";
import "./PopupFooter.css";

/* Handle the specific buttons that are found in the footer of the popup, being: 
    1) update quantity
    2) delete
   Button logic is handled in the footer
*/

function PopupFooter({ buttonList }) {
  return (
    <div className="popup-footer-container">
      {buttonList?.map((button) => {
          return (
            <PopupButton
              buttonColor={button.color}
              text={button.text}
              onClick={button.onClick}
            />
          );
        })}
    </div>
  );
}

export default PopupFooter;
