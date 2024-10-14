/**
 * Before run delete the current db
 * To run: node init_db.mjs    (in server folder)
 */

import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database('queue.sqlite', (err) => {
  if (err) throw err;
});

// Promisify the db.run and crypto.scrypt functions for better control of async operations
const runAsync = (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const scryptAsync = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
};

(async () => {
  try {
    await runAsync(db, `CREATE TABLE IF NOT EXISTS users (
      idUser INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL, -- hashed password
      role TEXT CHECK (role IN ('Manager', 'Officer'))
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS counters (
      idCounter INTEGER PRIMARY KEY
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            number INTEGER,
            service INTEGER,
            status TEXT CHECK(status IN ('waiting', 'called', 'served')) DEFAULT 'waiting',
            counter INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (service) REFERENCES services (idService)
    )`);
    
    await runAsync(db, `CREATE TABLE IF NOT EXISTS services (
      idService INTEGER PRIMARY KEY,
      serviceName TEXT NOT NULL,
      serviceTime REAL NOT NULL
    )`);

    await runAsync(db, `CREATE TABLE IF NOT EXISTS serviceForCounter (
      counter INTEGER,
      service INTEGER,
      PRIMARY KEY (counter, service),
      FOREIGN KEY (counter) REFERENCES counters (idCounter),
      FOREIGN KEY (service) REFERENCES services (idService)
    )`);

    await runAsync(db, `INSERT INTO counters (idCounter) VALUES
      (1),
      (2)`);  

    await runAsync(db, `INSERT INTO services (idService, serviceName, serviceTime) VALUES
      (1, 'shipping', 10),
      (2, 'account management', 5)`);

    await runAsync(db, `INSERT INTO serviceForCounter (counter, service) VALUES
      (1, 2),
      (2, 1),
      (2, 2)`);

    //TODO: add crypt for password
    await runAsync(db, `INSERT INTO users (idUser, name, email, password, role) VALUES
      (1, "officer", "officer@q.com", "officer", "Officer"),
      (2, "officer2", "officer2@q.com", "officer2", "Officer"),
      (3, "officer3", "officer3@q.com", "officer3", "Officer")
    `);

    console.log('Database initialized');
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
})();
