import React, { useState } from "react";
import ExpirationTag from "./ExpirationTag.jsx";
import "./Card.css";

/* props will include 3 separate params: 
        location:       allowing the user to navigate to the specific  
        name:           the name of the food item
        expirationDate: the expiration date of the food item
*/
function Card({ itemInfo, onClick }) {
  function onCardClick() {
    onClick(itemInfo);
  }

  function determineNameFormat() {
    if (itemInfo.FoodName) {
      return itemInfo.FoodName.length > 12
        ? itemInfo.FoodName.slice(0, 10) + "..."
        : itemInfo.FoodName;
    }
  }

  const format = determineNameFormat();

  // if image URL is present
  if (itemInfo.FoodImage && itemInfo.FoodImage !== "") {
    return (
      <>
        <div className="card-container" onClick={onCardClick}>
          <img
            className="card-img"
            src={itemInfo.FoodImage}
          ></img>
          <div className="card-background"></div>
          <div className="card-description">
            <div className="card-title">
              <b>{format}</b>
            </div>
            <ExpirationTag
              daysRemaining={itemInfo.ExpirationDate}
            />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="card-container" onClick={onCardClick}>
          <div className="card-description">
            <div className="card-title">
              <b>{format}</b>
            </div>
            <ExpirationTag
              daysRemaining={itemInfo.ExpirationDate}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Card;
