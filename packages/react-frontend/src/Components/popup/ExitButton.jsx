import React from "react";
import "./ExitButton.css";

function ExitButton({onClick}) {
    function onExitClick() {
        onClick();
    }

    return (
        <div className="exit-button-container">
            <div className="exit-button" onClick={onExitClick}>
                <b>x</b>
            </div>
        </div>
    );
}

export default ExitButton;
