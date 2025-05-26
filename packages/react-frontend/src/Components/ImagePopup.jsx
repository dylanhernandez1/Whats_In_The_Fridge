import React, { useState } from "react";
import ExitButton from "./popup/ExitButton.jsx";
import ImageDisplayer from "./popup/ImageDisplayer.jsx";
import PopupFooter from "./popup/PopupFooter.jsx";
import "./Popup.css";

function ImagePopup({foodInfo, onDelete}) {
  const [status, setStatus] = useState("popup-hidden");
  const [displayedImage, setDisplayedImage] = useState("");
  const [info, setInfo] = useState(undefined);

  if (foodInfo === undefined && status !== "popup-hidden") {
    setStatus("popup-hidden");
    setInfo(undefined);
  } else if (
    status === "popup-hidden" &&
    foodInfo !== undefined
  ) {
    setInfo(foodInfo);
    if(foodInfo !== undefined && foodInfo.length > 0) {
        const imageURL = foodInfo[0].urls.regular;
        onThumbnailChange(imageURL);
    } 
    setStatus("popup-active");
  }

  /* reset the popup to its default settings */
  function closePopup() {
    setDisplayedImage("");
    setStatus("popup-hidden");
  }

  /* The function to be called to close the popup. */
  /* return an empty string, meaning no selected image/url */
  function onCloseClicked() {
    onDelete("");
    closePopup()
  }

  function onSelectClicked() {
    const imageURL = displayedImage;
    onDelete(imageURL);
    closePopup()
  }

  function onThumbnailChange(imageURL) {
    setDisplayedImage(imageURL);
  }

  return (
    <div className={status}>
      <div className={`popup-frame-start`}>
        <div className="popup-frame-clip">
          <ExitButton onClick={onCloseClicked} />
          <ImageDisplayer images={info} onThumbnailChange={onThumbnailChange}/>
          <PopupFooter
            buttonList={[
                {color: "green",
                 text: "Select",
                 onClick: onSelectClicked
                }
            ]}
            />
        </div>
      </div>
    </div>
  );
}

export default ImagePopup;