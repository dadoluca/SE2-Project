import express from 'express';
import { callNextTicket, createTicket, getTicket } from '../controllers/ticketController.mjs'; 

const router = express.Router();

// Route to call the next ticket
router.post('/tickets/call', callNextTicket);

// Route to insert a ticket in DB
router.post('/tickets/create', createTicket);

// Route to retrieve a ticket by ID
router.post('/tickets/get', getTicket);

export default router;
