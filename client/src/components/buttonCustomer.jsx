import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import './buttonCustomer.css';

const CustButton = (props) => {
    return (
        <Button className="serviceButton" variant="none">
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

CustButton.PropTypes = {
    text: PropTypes.string,
    imag: PropTypes.string
}

export default CustButton;