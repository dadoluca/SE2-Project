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

export const getQueuesData = async () => {
  /*try {
    const response = await fetch(`${API_BASE_URL}/?????????????????????`);
    //, {credentials: 'include'});

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if(response.ok)
      return data;
    else
      throw err;
  } catch (err) {
    console.error('Failed to get the service data:', err);
    throw err;
  }*/
 return {
  //Example data
  "services": [
    {
      "title": "BILL PAYMENT",
      "icon": "💵",
      "serving": "B123",
      "queue": [
        { "number": "B123", "time": "2 min" },
        { "number": "B124", "time": "3 min" },
        { "number": "B125", "time": "4 min" },
        { "number": "B126", "time": "5 min" }
      ]
    },
    {

      "title": "WITHDRAWAL",
      "icon": "💳",
      "serving": "W123",
      "queue": [
        { "number": "W123", "time": "4 min" },
        { "number": "W124", "time": "8 min" },
      ]
    },
    {
      "title": "SHIPMENT",
      "icon": "📦",
      "serving": "S123",
      "queue": [
        { "number": "S123", "time": "1 min" },
        { "number": "S124", "time": "2 min" },
        { "number": "S125", "time": "3 min" },
        { "number": "S126", "time": "4 min" }
      ]
    }
  ],
}

}