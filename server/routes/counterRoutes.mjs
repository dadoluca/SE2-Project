import express from 'express';
import { getAllCounters, getCounterServices } from '../controllers/counterController.mjs'; 

const router = express.Router();

// Route to retrieve all counters
router.get('/counters', getAllCounters);

// Route to retrieve counter's services
router.get('/counters/:idCounter', getCounterServices);

export default router;