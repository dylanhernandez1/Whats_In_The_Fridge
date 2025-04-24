import React, { useState } from "react";
import "./Popup.css";

function Popup({foodInfo}) {
    console.log(foodInfo);
    const [status, setStatus] = useState("popup-hidden");

    /* If props.foodInfo being passed to Popup is undefined, means: 
       1) No card has been pressed yet, so don't display the popup

       Otherwise, if props.foodInfo is defined AND "status" is hidden (meaning there is no current popup activated)
       activate the popup and set the status accordingly
    */
    if (foodInfo === undefined && status !== "popup-hidden") {
        setStatus("popup-hidden");
    } else if (status === "popup-hidden" && foodInfo !== undefined) {
        console.log("setting satus yippee");
        setStatus("popup-active");
    }

    return (
        <div className={status}>
            <div className="popup-testing">

            </div>
        </div>
    );
}

export default Popup;