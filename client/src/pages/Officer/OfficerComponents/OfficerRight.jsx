import React from "react";
import './Officer.css';

function OfficerRightSide() {
  return (
    <div className="right-section">
      {/* Bill Payment Section */}
      <div className="bill-payment-header">
        <h2>BILL PAYMENT</h2>
        <p className="serving-label">
          SERVING: <span className="current-ticket">B123</span>
        </p>
        <div className="next-tickets">
          <h3>NEXT:</h3>
          {/* List of next tickets */}
          <ul className="ticket-list">
            <li>B124</li>
            <li>B125</li>
            <li>B126</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OfficerRightSide;