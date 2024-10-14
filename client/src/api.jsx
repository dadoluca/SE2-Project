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

export const getTicket = async (idTicket) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${idTicket}`);
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

export const getService = async (idTicket) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${idTicket}`);
    //, {credentials: 'include'});

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (err) {
    console.error('Failed to get the service:', err);
    throw err;
  }
};

export const getAllService = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    //, {credentials: 'include'});

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (err) {
    console.error('Failed to get services list:', err);
    throw err;
  }
};

export const getAllCounters = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/counters`);
    //, {credentials: 'include'});

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (err) {
    console.error('Failed to get counters list:', err);
    throw err;
  }
};

export const getCounterServices = async (idCounter) => {
  try {
    const response = await fetch(`${API_BASE_URL}/counters/${idCounter}`);
    //, {credentials: 'include'});

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (err) {
    console.error('Failed to get counter services list:', err);
    throw err;
  }
};