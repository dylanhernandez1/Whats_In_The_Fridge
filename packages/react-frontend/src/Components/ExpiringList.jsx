import React, { useState, useEffect } from "react";
import Card from "./card/Card.jsx";
import "./StyleSheet.css";

/* ExpiringList has two main containers: 
        expiring-list-header: Contains the container title and "see more" link
        expiring-list:        Contains the foods, formatted in Card components, that are expiring the earliest in a scrollable frame
*/
function ExpiringList() {
  const [list, setList] = useState(
    [
        {
            id: 1234,
            name: "Apple",
            expirationDate: 1,
            location: "Fridge"
        },
        {
            id: 2345,
            name: "Cheese",
            expirationDate: 3,
            location: "Fridge"
        },
        {
            id: 3456,
            name: "Banana",
            expirationDate: 6,
            location: "Fridge"
        },
        {
            id: 4567,
            name: "Eggs",
            expirationDate: 7,
            location: "Fridge"
        },
        {
            id: 5678,
            name: "Crackers",
            expirationDate: 9,
            location: "Pantry"
        },
        {
            id: 6789,
            name: "Water",
            expirationDate: 200,
            location: "Pantry"
        },
    ]
);

  /* Have this run each time ExpiringList is mounted */
  useEffect(() => {}, []);

  /* navigate to a specific location when clicking on a Card component */
  function onClick(location) {}

  return (
    <div className="expiring-list-container">
      <div className="expiring-list-header">
        <div className="expiring-list-title">
          <b>Expiring Soon</b>
        </div>
        <div className="expiring-list-see-more">See more</div>
      </div>
      <div className="expiring-list">
        {list?.map((item) => {
            return (
                <Card key={item.id}
                    name={item.name}
                    expirationDate={item.expirationDate}
                    location={item.location}
                    onClick={onClick}
                />
            );
        })}
      </div>
    </div>
  );
}

export default ExpiringList;
