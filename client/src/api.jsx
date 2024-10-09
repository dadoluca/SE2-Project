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