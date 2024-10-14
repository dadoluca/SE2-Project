import express from 'express';
import { callNextTicket, createTicket, getTicket } from '../controllers/ticketController.mjs'; 
import { getTicketHistory } from '../controllers/ticketController.mjs';
import { serveTicket } from '../controllers/ticketController.mjs';

const router = express.Router();

// Route to call the next ticket
router.post('/tickets/call', callNextTicket);

// Route to insert a ticket in DB
router.post('/tickets/create', createTicket);

// Route to retrieve a ticket by ID
router.post('/tickets/get', getTicket);
// Rout to get thehistory of a ticket by ID
router.get('/tickets/:ticketID/history', getTicketHistory);

//Route to mark a tickt as served
router.post('/tickets/serve', serveTicket);


export default router;
