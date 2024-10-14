import express from 'express';
import {
    callNextTicket,
    assignTicketToCounter,
    resetQueue,
    serveTicket,
    getQueuesData
} from '../controllers/queueController.mjs';

const router = express.Router();

// Endpoint to call the next ticket
router.post('/call-next', callNextTicket);

// Endpoint to serve (mark) the ticket as served
router.post('/serve', serveTicket);

// Endpoint to assign a ticket to a specific counter
router.put('/tickets/:id/assign', assignTicketToCounter);

// Endpoint to reset the queue (clear all tickets)
router.delete('/queue/reset', resetQueue);

// Route to retrieve all queues
router.get('/all', getQueuesData);

export default router;
