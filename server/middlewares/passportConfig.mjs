import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { openDatabase } from '../config/db.mjs';
import { verifyPassword } from '../utils/hashUtils.mjs'; 

// Passport Local Strategy
passport.use(
  new LocalStrategy({ usernameField: 'name', passwordField: 'password' }, (name, password, done) => {
    const db = new sqlite3.Database('queue.sqlite', (err) => {
      if (err) {
        console.error('Failed to connect to the database:', err);
        return done(err);
      }
    });

    db.get(`SELECT * FROM users WHERE name = ?`, [name], async (err, user) => {
      if (err) {
        console.error('Error querying the database:', err);
        return done(err);
      }
      if (!user) return done(null, false, { message: 'Incorrect username.' });

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    });
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
