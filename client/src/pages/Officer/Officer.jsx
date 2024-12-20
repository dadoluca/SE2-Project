import React, { useState } from "react";
import './OfficerComponents/Officer.css';
import OfficerLeftSide from './OfficerComponents/OfficerLeft';
import OfficerRightSide from './OfficerComponents/OfficerRight';

function OfficerUI() {

    const [currentTime, setCurrentTime] = useState(new Date());

    // Funzione per aggiornare l'orario ogni secondo
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <OfficerLeftSide></OfficerLeftSide>

            <div className="separator"></div>

            <OfficerRightSide></OfficerRightSide>
        </div>
    )
}

export default OfficerUI;
 