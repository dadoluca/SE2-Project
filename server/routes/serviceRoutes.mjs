import express from 'express';
import { getAllServices, getService } from '../controllers/serviceController.mjs'; 

const router = express.Router();

// Route to retrieve a service
router.get('/services/:idService', getService);

// Route to retrieve all services
router.get('/services', getAllServices);

export default router;