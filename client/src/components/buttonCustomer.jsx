import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const CustButton = (props) => {
    return (
        <Button className="serviceButton" variant="none">
           <div className="buttonContent">
                <div className="buttonText">
                     {props.text}
                </div>
                <div className="buttonIcon">
                     {props.icon}
                </div>
           </div>
        </Button>
    );
}

CustButton.PropTypes = {
    text: PropTypes.string,
    icon: PropTypes.icon
}

export default CustButton;