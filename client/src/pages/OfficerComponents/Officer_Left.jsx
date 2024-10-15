import React, { useState, useEffect } from "react";
import './Officer.css'

function OfficerLeftSide() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Function to format time in hh:mm format
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to format date in 'dd mmm yyyy' format
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Updating time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 600);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="left-section">
      {/* Header for Date and Time */}
      <div className="header">
        <div className="date">{formatDate(currentTime)}</div>
        <div className="time">{formatTime(currentTime)}</div>
      </div>

      {/* Officer Information */}
      <div className="officer-info">
        <div className="officer-avatar"></div>
        <div className="officer-id">OFFICER #1234</div>
      </div>

      {/* Action Buttons */}
      <div className="actions">
        <button className="served-button">SERVED</button>
        <button className="call-next-button">CALL NEXT</button>
      </div>
    </div>
  );
}

export default OfficerLeftSide;
