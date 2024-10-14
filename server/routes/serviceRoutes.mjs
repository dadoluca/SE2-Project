import express from 'express';
import { getAllServices, getService } from '../controllers/serviceController.mjs'; 

const router = express.Router();

// Route to retrieve a service
router.get('/:idService', getService);

// Route to retrieve all services
router.get('/all', getAllServices);

export default router;