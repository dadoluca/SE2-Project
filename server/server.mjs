import express from 'express';                   
import ticketRoutes from './routes/ticketRoutes.mjs'; 
import { errorMiddleware } from './middlewares/errorMiddleware.mjs'; 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// API route for tickets
app.use('/api', ticketRoutes);

// Middleware for error handling
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
