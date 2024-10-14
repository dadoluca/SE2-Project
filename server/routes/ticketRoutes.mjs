import express from 'express';
import { createTicket,
         deleteTicket,
         getTicketById,
         getTicketStatistics,
         getAllTickets,
         updateTicketStatus
        } 
from '../controllers/ticketController.mjs'; 


const router = express.Router();


// Route to insert a ticket in DB
router.post('/tickets/create', createTicket);

// Endpoint to delete a specific ticket
router.delete('/tickets/:id', deleteTicket);

// Endpoint to get details of a specific ticket by ID
router.get('/tickets/:id', getTicketById);

// Endpoint to get ticket statistics
router.get('/tickets/stats', getTicketStatistics);

// Endpoint to get all tickets
router.get('/tickets', getAllTickets);

// Endpoint to update the status of a specific ticket
router.put('/tickets/:id', updateTicketStatus);




export default router;
