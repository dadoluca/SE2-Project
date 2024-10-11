import PropTypes from 'prop-types';
import React, { useState } from 'react';
import QRCode from 'react-qr-code';

function QRCodeGenerator(props){
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  //taking input value for QR code from props 
  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <QRCode value={text || "default"} size={200} />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
