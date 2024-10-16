import React, { useState } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';

function QRCodeGenerator(props){
  //taking input value for QR code from the parameters of the propTypes
  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <QRCode value={props.ticket} size={200} />
      </div>
    </div>
  );
};

QRCodeGenerator.propTypes = {
  ticket: PropTypes.string
}

export default QRCodeGenerator;
