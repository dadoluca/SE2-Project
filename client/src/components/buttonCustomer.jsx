import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './buttonCustomer.css';

function CustButton(props) {
    const navigate = useNavigate();

    const handleButton = () =>{
        navigate(props.routePath);
    }

    return (
        <Button className="serviceButton" variant="none" onClick={handleButton}>
           <div className="buttonContent">
                <div className="buttonText">
                     {props.text}
                </div>
                <div className="buttonIcon">
                    <i className={props.imag}></i>
                </div>
           </div>
        </Button>
    );
}

CustButton.propTypes = {
    text: PropTypes.string,
    imag: PropTypes.string,
    routePath: PropTypes.string
}

export default CustButton;