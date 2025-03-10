import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import "./Notification_Styling.css";

function Notifications({ foodList }) {
  const [show, setShow] = useState(false);

  //filter foods that expire in 3 days or less
  const expiringSoon =
    foodList?.filter((item) => item.expirationDate <= 3) || [];

  const notifications = expiringSoon.map(
    (item) =>
      `${item.name} expires in ${item.expirationDate} days`
  );

  return (
    <div className="notifications-container">
      <button
        onClick={() => setShow(!show)}
        className="notifications-button"
        style={{ backgroundColor: "transparent", border: 0 }}
      >
        <FaBell className="icon" />
      </button>
      {show && (
        <div className="notifications-dropdown">
          {notifications.length > 0 ? (
            notifications.map((note, id) => (
              <div key={id} className="notification-item">
                {note}
              </div>
            ))
          ) : (
            <div className="notification-item">
              No expiring items
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
