import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { openDatabase } from '../config/db.mjs'; // Adjust the path according to your project structure
import { verifyPassword } from '../utils/hashUtils.mjs'; // Assuming you have a password verification utility

// Passport Local Strategy
passport.use(
  new LocalStrategy(async (name, password, done) => {
    try {
      const db = await openDatabase(); // Open the database
      db.get(`SELECT * FROM users WHERE name = ?`, [name], async (err, user) => {
        if (err) return done(err); // Handle database error
        if (!user) return done(null, false, { message: 'Incorrect name.' }); // User not found

        // Verify the password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) return done(null, false, { message: 'Incorrect password.' }); // Password mismatch

        return done(null, user); // Successful authentication
      });
    } catch (err) {
      return done(err); // Handle unexpected error
    }
  })
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.idUser); // Store user ID in session
});

// Deserialize user from session
passport.deserializeUser((idUser, done) => {
  const db = openDatabase();
  db.get(`SELECT * FROM users WHERE idUser = ?`, [idUser], (err, user) => {
    if (err) return done(err); // Handle database error
    done(null, user); // Restore user object
  });
});

export default passport; // Export the configured passport instance
