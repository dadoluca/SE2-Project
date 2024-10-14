import React, { useState } from 'react';
import { callNextTicket } from '../api';

const QueueManager = () => {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  const handleCallNextTicket = async () => {
    try {
      setError('');
      const ticketData = await callNextTicket();
      setTicket(ticketData.ticket);
    } catch (err) {
      setError('Could not call the next ticket. Please try again.');
    }
  };

  return (
    <div>
      <h1>Queue Manager</h1>
      <button onClick={handleCallNextTicket}>Call Next Ticket</button>
      {ticket && (
        <div>
          <h2>Called Ticket</h2>
          <p>ID: {ticket.idTicket}</p>
          <p>Service: {ticket.service}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default QueueManager;
