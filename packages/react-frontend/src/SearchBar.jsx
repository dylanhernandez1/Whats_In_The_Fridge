import React, { useState } from "react";
import "./StyleSheet.css";
import { FaSearch, FaFilter } from "react-icons/fa";

function SearchBar() {
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

  function addFilterOptions() {}

  return (
    <form className="search-bar-container">
      <FaSearch className="search-bar-container-icon" />
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleUnfocused}
        className="search-input"
        style={{
          border: "none",
          boxShadow: "none",
          outline: "none"
        }}
      />
      <button onClick={addFilterOptions}>
        <FaFilter className="icon" />
        <span className="button-text"></span>
      </button>
    </form>
  );
}

export default SearchBar;
