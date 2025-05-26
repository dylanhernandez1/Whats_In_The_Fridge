import React, { useState, useEffect } from "react";
import "./Navigator.css";

function Navigator(props) {
  /* handle the state regarding the navigator:                                        
          transitioning: If transitioning, clicks from navigate buttons debounce
          position: determine the location of the navigator to simulate movement     */
  const [transitioning, setTransitioning] = useState(false);
  const [position, setPosition] = useState("center");

  function changeThumbnail(direction) {
    if (!transitioning) {
      setTransitioning(true);
      setPosition(direction);
      /* pass the direction up to Thumbnail.jsx to update the index */
      props.updateIndex(direction);
    }
  }
  /* if component mounts, useEffect is ran to connect
       our transitionEnded event */
  useEffect(() => {
    /* specifically listen to the animationend events from .navigator-icon.navigate-center */
    const nav = document.querySelector(
      ".navigator-icon.navigate-center"
    );

    nav.addEventListener("animationend", (event) => {
      setPosition("center");
      setTransitioning(false);
    });
  }, []);

  return (
    /* our container handles the movement aspect of the transition event 
           onClick needs specific paramters, so we wrap the function call in a lambda */
    <div className={`navigator ${position}`}>
      <div className="navigator-icon invis-left"></div>
      <div
        className="navigator-icon navigate-left"
        onClick={() => {
          changeThumbnail("right");
        }}
      ></div>
      <div className="navigator-icon navigate-center"></div>
      <div
        className="navigator-icon navigate-right"
        onClick={() => {
          changeThumbnail("left");
        }}
      ></div>
      <div className="navigator-icon invis-right"></div>
    </div>
  );
}

export default Navigator;
