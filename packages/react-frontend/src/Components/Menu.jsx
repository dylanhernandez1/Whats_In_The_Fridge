import React, { useState } from "react";
import "./Header_Styling.css";
import { FaBars } from "react-icons/fa";

function Menu(props) {
  const CurrentContainer = "All";
  const [show, setShow] = useState(false);

  function FilterDropDown() {
    //Input sink
  }
  function getCurrentContainer() {
    //hard coded fridge for now
    return "All";
  }

  function getFoodByContainer() {
    const promise = fetch("http://localhost:8000/food", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log("Foods: ", res);

        for (let i = 0; i < res.length; i++) {
          if (getCurrentContainer() == "All") {
            console.log(res[i]);
          } else if (res[i].name == getCurrentContainer()) {
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

  return (
    <div className="">
      <button
        onClick={() => setShow(!show)}
        style={{ backgroundColor: "transparent", border: 0 }}
      >
        <FaBars className="icon" />
        <span className="button-text"></span>
      </button>
      {show && (
        <div className="menu-dropdown">
          <button>
            <span className="search-bar-container button">
              Fridge
            </span>
          </button>
          <button>
            <span className="search-bar-container button">
              Freezer
            </span>
          </button>
          <button>
            <span className="search-bar-container button">
              Pantry
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;
