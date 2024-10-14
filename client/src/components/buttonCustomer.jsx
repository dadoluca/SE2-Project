import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {createTicket} from '../api.jsx'

import './buttonCustomer.css';

function CustButton(props) {
    const navigate = useNavigate();

    const handleButton = () =>{
        const data = createTicket(props.serviceId);
        const path = '/customer-mainboard' + props.routePath;
        navigate(path, {ticketId: data.ticket.id});
    }

    return (
        <Button className="serviceButton" variant="none" onClick={handleButton}>
           <div className="buttonContent">
                <div className="buttonText">
                     {props.text}
                </div>
           </div>
        </Button>
    );
}

CustButton.propTypes = {
    serviceId: PropTypes.number,
    text: PropTypes.string,
    imag: PropTypes.string,
    routePath: PropTypes.string
}

export default CustButton;