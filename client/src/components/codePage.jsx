import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import QRCodeGenerator from './QRCodeGenerator';
import { useNavigate, useLocation } from 'react-router-dom';
import './codePage.css';

const QRCodePage = () =>{
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackHome = () =>{
        navigate('/customer-mainboard');
    }

    return(
        <div>
            <h1>SCAN QR CODE</h1>
            <div className="QRCodeContainer">
                <div className="QRCodeContainer">
                    <QRCodeGenerator ticket={location.state.ticket}/>
                </div>
                <Button className="backHomeButton" onClick={handleBackHome}>
                        {"🏠BACK TO HOME"}
                </Button>
            </div>
        </div>
    )
}

export default QRCodePage;