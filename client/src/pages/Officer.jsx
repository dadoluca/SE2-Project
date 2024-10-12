import React, { useState } from "react";
import './Officer.css';

function OfficerUI() {

    const [currentTime, setCurrentTime] = useState(new Date());

    // Funzione per aggiornare l'orario ogni secondo
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="container">
            {/* Sezione sinistra (2/3 della pagina) */}
            <div className="left-section">
                {/* Data e Ora */}
                <div className="header">
                    <div className="date">{formatDate(currentTime)}</div>
                    <div className="time">{formatTime(currentTime)}</div>
                </div>

                {/* Informazioni sull'officer */}
                <div className="officer-info">
                    <div className="officer-avatar"></div>
                    <div className="officer-id">OFFICER #1234</div>
                </div>

                {/* Pulsanti */}
                <div className="actions">
                    <button className="served-button">SERVED</button>
                    <button className="call-next-button">CALL NEXT</button>
                </div>
            </div>


            <div className="separator"></div>

            <div className="right-section">
                {/* Sezione "BILL PAYMENT" */}
                <div className="bill-payment-header">
                    <h2>BILL PAYMENT</h2>
                    <p className="serving-label">SERVING: <span className="current-ticket">B123</span></p>
                    <div className="next-tickets">
                    <h3>NEXT:</h3>
                {/* Lista dei prossimi numeri */}
                    <ul className="ticket-list">
                        <li>B124</li>
                        <li>B125</li>
                        <li>B126</li>
                    </ul>
                </div>
                </div>

            </div>
        </div>

    )
}

export default OfficerUI;
