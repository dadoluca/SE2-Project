import express from 'express';
import { callNextTicket } from '../controllers/ticketController.mjs'; 

const router = express.Router();

// Route to call the next ticket
router.post('/tickets/call', callNextTicket);

export default router;
