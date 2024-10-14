import express from 'express';
import { getQueuesData } from '../controllers/queueController.mjs'; 

const router = express.Router();

// Route to retrieve all queues
/* Example data:
{
  "message": "Queues retrieved",
  "services": [
    {
      "title": "Service1",
      "serving": "B123",
      "queue": ["B123", "B124", "B125"]
    },
    {
      "title": "Service2",
      "serving": "A100",
      "queue": ["A100", "A101", "A102"]
    }
  ]
} */
router.get('/queues', getQueuesData);

export default router;