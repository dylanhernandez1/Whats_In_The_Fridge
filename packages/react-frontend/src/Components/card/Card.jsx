import React from "react";
import ExpirationTag from "./ExpirationTag.jsx";
import "./Card.css";

/* props will include 3 separate params: 
        location:       allowing the user to navigate to the specific  
        name:           the name of the food item
        expirationDate: the expiration date of the food item
*/
function Card(props) {
  return (
    <>
        <div className="card-container">
        <img className="card-img"></img>
            <div className="card-description">
                <div className="card-title"><b>{props.name}</b></div>
                <ExpirationTag daysRemaining={props.expirationDate}/>
            </div>
        </div>
    </>
  );
}

export default Card;
