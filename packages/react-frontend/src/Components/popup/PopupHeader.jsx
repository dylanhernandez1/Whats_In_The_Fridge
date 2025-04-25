import React from "react";
import ExpirationTag from "../card/ExpirationTag.jsx";
import "./PopupHeader.css";

function PopupHeader({ foodName, expirationDate }) {
  return (
    <div className="popup-header-container">
      <div className="popup-header-title">{foodName}</div>
      <ExpirationTag daysRemaining={expirationDate} />
    </div>
  );
}

export default PopupHeader;
