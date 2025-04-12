import React from "react";
import "./ExpirationTag.css";

const ExpirationTag = (props) => {
  /* determine the tag content */
  function determineTagContent(daysRemaining) {
    if (daysRemaining != undefined && daysRemaining > 0) {
      const value =
        daysRemaining >= 365
          ? Math.round(daysRemaining / 365) > 99 
            ? "99+"
              : Math.round(daysRemaining / 365)
          : daysRemaining;
      const units =
        daysRemaining >= 365
          ? value > 1 || value === "99+"
            ? "years"
            : "year"
          : daysRemaining > 1
            ? "days"
            : "day";
      return `${value} ${units}`;
    } else if (daysRemaining != undefined && daysRemaining <= 0) {
      return "Expired";
    } else {
      return "No date";
    }
  }

  /* determine the tag color (specified in ExpirationTag.css) based on the expiration date */
  function determineTagColor(daysRemaining) {
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

  const tagColor = determineTagColor(props.daysRemaining);
  const tagContent = determineTagContent(props.daysRemaining);

  return (
    <div
      className={`${props.daysRemaining > 100 ? "expiration-tag-small" : "expiration-tag"} ${tagColor}`}
    >
      <b>{tagContent}</b>
    </div>
  );
};

export default ExpirationTag;
