// src/routes/authRoutes.mjs

import express from 'express';
import passport from '../middlewares/passportConfig.mjs'; // Adjust the path according to your project structure

const router = express.Router();

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred during authentication.' });
    }
    if (!user) {
      return res.status(401).json({ error: info.message }); // Missing credentials
    }

    // Log in the user
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log in user.' });
      }
      return res.status(200).json({ message: 'Logged in successfully', user }); // Successful login
    });
  })(req, res, next);
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred during logout.' });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});


export default router;
