import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import QRCodeGenerator from './QRCodeGenerator';
import { useNavigate } from 'react-router-dom';

const QRCodePage = () =>{
    const navigate = useNavigate();
    
    const handleBackHome = () =>{
        navigate('/customer-mainboard');
    }

    return(
        <div>
            <h1>SCAN QR CODE</h1>
            <div className="QRCodeContainer">
                <div className="QRCodeContainer">
                    <QRCodeGenerator/>
                </div>
                <div className="backHomeButton">
                    <Button variant="none" onClick={handleBackHome}>
                        <div className="buttonContent">
                            <div className="buttonIcon">
                                <i className="bi bi-arrow-left-short"></i>
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default QRCodePage;