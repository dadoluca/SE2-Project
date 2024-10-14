import express from 'express';                   
import ticketRoutes from './routes/ticketRoutes.mjs'; 
import { errorMiddleware } from './middlewares/errorMiddleware.mjs';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/authRoutes.mjs';
import cors from 'cors';

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
};

// Use CORS middleware
app.use(cors(corsOptions));

// Middleware for session management
app.use(
  session({
    secret: 'secret_key', 
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());



// Middleware to parse JSON data
app.use(express.json());

// API route for tickets
app.use('/api', ticketRoutes);

// Middleware for error handling
app.use(errorMiddleware);

// Use authentication routes
app.use('/auth', authRoutes);


const PORT = process.env.PORT || 5001;
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
