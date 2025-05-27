import React, { useState } from "react";
import Navigator from "./Navigator.jsx";
import "./ImageDisplayer.css";

function ImageDisplayer({ images, onThumbnailChange }) {
  const [index, setIndex] = useState(0);

  // images will be set to undefined when the user selects/exits out of the prompt,
  // so reset the index when this occurs
  if (images === undefined && index !== 0) {
    setIndex(0);
  }

  function updateIndex(direction) {
    let indexAdjustment = 0;
    if (direction === "left") {
      indexAdjustment = -1;
    } else if (direction === "right") {
      indexAdjustment = 1;
    }
    // Debounce if the imageList is undefined
    if (images === undefined) {
      return;
    }

    let toIndex = 0;
    // Check edge cases
    if (index + indexAdjustment < 0) {
      toIndex = images.length - 1;
    } else if (index + indexAdjustment > images.length - 1) {
      toIndex = 0;
    } else {
      toIndex = index + indexAdjustment;
    }
    setIndex(toIndex);

    // update the thumbnail url
    const url = images[toIndex].urls.regular;
    onThumbnailChange(url);
  }

  return (
    <div className="image-displayer-container">
      <img
        className="image-displayer"
        src={images ? images[index].urls.regular : ""}
      ></img>
      <Navigator updateIndex={updateIndex} />
    </div>
  );
}

export default ImageDisplayer;
