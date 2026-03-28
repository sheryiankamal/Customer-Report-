import React, { useState } from "react";

const Noti = ({ notifications, setBell }) => {
  const [isClosing, setIsClosing] = useState(false);

  const closePanel = () => {
    if (!isClosing) {
      setIsClosing(true);
    }
  };

  return (
    <div
      className="overlay"
      onClick={closePanel}
      style={{ pointerEvents: isClosing ? "none" : "auto" }}
    >
      <div
        className={`notification ${
          isClosing ? "notification-out" : "notification-in"
        }`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={(e) => {
          if (e.target.classList.contains("notification-out")) {
            setBell(false);
          }
        }}
      >
        <div
          className="px-3 flex justify-end cursor-pointer"
          onClick={closePanel}
        >
          X
        </div>

        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((n) => (
            <p key={n.id} className="text-sm">
              {n.message}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default Noti;
