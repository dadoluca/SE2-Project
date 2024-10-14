import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { useLocation } from 'react-router-dom';

function QRCodeGenerator(){
  const [text, setText] = useState('');

  const handleChange = () => {        //creating a QRCode according to the ticket ID
    const location = useLocation();
    setText(location.idTicket);
  };

  //taking input value for QR code from the parameters of the useNavigate function
  return (
    <div>
      <div style={{ marginTop: '20px' }}>
        <QRCode value={text || "default"} size={200} />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
