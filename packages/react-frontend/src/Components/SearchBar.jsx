import React, { useState } from "react";
import "./StyleSheet.css";
import { FaSearch } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";

function SearchBar(props) {
  const [text, setText] = useState("Search");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleFocus = (e) => {
    if (!isFocused) {
      setText("");
      setIsFocused(true);
    }
  };

  const handleUnfocused = (e) => {
    if (text === "") {
      setText("Search");
      setIsFocused(false);
    }
  };

  //temporarily adds food to the database
  function postText() {
    const promise = fetch("http://localhost:8000/food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: text
      })
    });
    return promise;
  }

  function getFoodFromText() {
    const promise = fetch("http://localhost:8000/food", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return promise;
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Search text: ", text);

      getFoodFromText().then((res) => {
        if (res.status === 201) {
          console.log(res);
        }
      });
    } else if (e.key === "Shift") {
      e.preventDefault();
      console.log("Search text: ", text);

      postText().then((res) => {
        if (res.status === 201) {
          console.log(res);
        }
      });
    }
  };

  function FilterDropDown() {}

  return (
    <form className="search-bar-container">
      <FaSearch className="search-bar-container-icon" />
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleUnfocused}
        onKeyDown={handleKeyDown}
        className="search-input"
        style={{
          border: "none",
          boxShadow: "none",
          outline: "none"
        }}
      />
      <button onClick={FilterDropDown} style={{ border: 0 }}>
        <IoIosOptions className="icon" />
      </button>
    </form>
  );
}

export default SearchBar;
