import React from "react";
import "./ExpirationTag.css";

const ExpirationTag = (props) => {
  function buildString() {
    const label = props.daysRemaining > 1 ? "days" : "day";
    return `${props.daysRemaining} ${label}`;
  }

  /* determine the tag color (specified in ExpirationTag.css) based on the expiration date */
  function determineTag(daysRemaining) {
    let tagClass = "expiration-green";
    if (daysRemaining != undefined) {
      if (daysRemaining <= 3) {
        tagClass = "expiration-red";
      } else if (daysRemaining <= 7) {
        tagClass = "expiration-yellow";
      }
    }
    return tagClass;
  }
  const tag = determineTag(props.daysRemaining);

  return (
    <div
      className={`${props.daysRemaining > 100 ? "expiration-tag-small" : "expiration-tag"} ${tag}`}
    >
      <b>
        {props.daysRemaining
          ? `${props.daysRemaining} ${props.daysRemaining > 1 ? "days" : "day"}`
          : "No date added"}
      </b>
    </div>
  );
};

export default ExpirationTag;
