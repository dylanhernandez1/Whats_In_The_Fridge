import React, { useState } from "react";
import "./Header_Styling.css";
import { FaBars } from "react-icons/fa";
const URL =
  "whats-in-the-fridge-e2f8g5etfbarcmdk.westus-01.azurewebsites.net";

function Menu({ onMenuSwitch }) {
  let CurrentContainer;
  const [show, setShow] = useState(false);

  function getFoodByContainer() {
    const promise = fetch(`https://${URL}/food`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (onMenuSwitch) {
          onMenuSwitch(CurrentContainer);
        }

        return res.json();
      })
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          if (CurrentContainer === "All") {
            console.log(res[i]);
          } else if (res[i].Location == CurrentContainer) {
            console.log(res[i]);
            //display item if current container
          }
        }

        return res;
      })
      .catch((error) => {
        console.error("Error: ", error);
        return [];
      });

    return promise;
  }

  function setCurrentContainer(location) {
    CurrentContainer = location;
    getFoodByContainer();
    console.log(CurrentContainer);
  }

  return (
    <div>
      <button
        className="menu-button"
        onClick={() => setShow(!show)}
        style={{ backgroundColor: "transparent", border: 0 }}
      >
        <FaBars className="icon" />
        <span className="button-text"></span>
      </button>
      {show && (
        <div className="menu-dropdown">
          <button
            className="menu-item"
            style={{ border: 0 }}
            onClick={() => setCurrentContainer("Fridge")}
          >
            Fridge
          </button>
          <button
            className="menu-item"
            style={{ border: 0 }}
            onClick={() => setCurrentContainer("Freezer")}
          >
            Freezer
          </button>
          <button
            className="menu-item"
            style={{ border: 0 }}
            onClick={() => setCurrentContainer("Pantry")}
          >
            Pantry
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;
