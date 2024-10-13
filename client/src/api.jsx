const API_BASE_URL = 'http://localhost:5000/api'; 

export const callNextTicket = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Failed to call next ticket:', error);
    throw error;
  }
};

export const createTicket = async (idTicket, day, service, counter, served) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //credentials: 'include',
      body: JSON.stringify({idTicket: idTicket, day: day, service: service, counter: counter, served: served})
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (err) {
    console.error('Failed to create a new ticket:', err);
    throw err;
  }
};

export const getTicket = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/get`);
    //, {credentials: 'include'});

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (err) {
    console.error('Failed to get the ticket:', err);
    throw err;
  }
};