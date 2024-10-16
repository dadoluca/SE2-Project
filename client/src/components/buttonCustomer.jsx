import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {createTicket} from '../api.jsx'

import './buttonCustomer.css';

function CustButton(props) {
    const navigate = useNavigate();

    const handleButton = () =>{
        const path = '/customer-mainboard' + props.routePath;
        createTicket(props.serviceId).then((res) => {
            const ticket = res.ticket.number;
            navigate(path, {state: {ticket: ticket}});
        });
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
    service: PropTypes.string,
    text: PropTypes.string,
    imag: PropTypes.string,
    routePath: PropTypes.string
}

export default CustButton;