import React, { useState } from "react";
import "./StyleSheet.css";

function SearchBar() {
  const [text, setText] = useState("Search");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleFocus = () => {
    if (!isFocused) {
      setText("");
      setIsFocused(true);
    }
  };

  const handleUnfocused = () => {
    if (text === "") {
      setText("Search");
      setIsFocused(false);
    }
  };

  return (
    <form className="search-bar-container">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleUnfocused}
        className="search-input"
      />
    </form>
  );
}

export default SearchBar;
