import React, { useState, useEffect } from "react";
import Card from "./card/Card.jsx";
import Notifications from "./Notifications.jsx";
import "./ExpiringList_styling.css";

/* ExpiringList has two main containers: 
        expiring-list-header: Contains the container title and "see more" link
        expiring-list:        Contains the foods, formatted in Card components, that are expiring the earliest in a scrollable frame
*/
function ExpiringList(props) {
  /* */
  function onCardClick(foodInfo) {
    props.onClick(foodInfo);
  }

  return (
    <div className="expiring-list-container">
      <div className="expiring-list-header">
        <div className="expiring-list-title">
          <b>Expiring Soon</b>
        </div>
        <div className="expiring-list-see-more">See more</div>
      </div>
      <div className="expiring-list">
        {props.foodList?.map((item) => {
          return (
            <Card
              key={item.id}
              itemInfo={item}
              onClick={onCardClick}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ExpiringList;
