import express from 'express';
import {
    callNextTicket,
    getNextTicket,
    getAllWaitingTickets,
    assignTicketToCounter,
    resetQueue,
    serveTicket
} from '../controllers/queueController.mjs';

const router = express.Router();

// Endpoint to call the next ticket
router.post('/call-next', callNextTicket);

// Endpoint to serve (mark) the ticket as served
router.post('/serve', serveTicket);


// Endpoint to get the next waiting ticket
router.get('/tickets/next', getNextTicket);

// Endpoint to get all waiting tickets
router.get('/tickets/waiting', getAllWaitingTickets);




// Endpoint to assign a ticket to a specific counter
router.put('/tickets/:id/assign', assignTicketToCounter);

// Endpoint to reset the queue (clear all tickets)
router.delete('/queue/reset', resetQueue);

export default router;
