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
      idTicket INTEGER PRIMARY KEY,
      number TEXT,
      service INTEGER,
      status TEXT CHECK(status IN ('waiting', 'called', 'served')) DEFAULT 'waiting',
      counter INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service) REFERENCES services (idService)
    )`);
    
    await runAsync(db, `CREATE TABLE IF NOT EXISTS services (
      idService INTEGER PRIMARY KEY,
      serviceName TEXT NOT NULL,
      serviceTime REAL NOT NULL,
      icon TEXT
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

    await runAsync(db, `INSERT INTO services (idService, serviceName, serviceTime, icon) VALUES
      (1, 'BILL PAYMENT', 10, '/icons/bill_payment.png'),
      (2, 'WITHDRAWAL', 7, '/icons/withdrawal.png'),
      (3, 'SHIPMENT', 12, '/icons/shipment.png')
    `);

    await runAsync(db, `INSERT INTO serviceForCounter (counter, service) VALUES
      (1, 1),
      (1, 2),
      (2, 3)
    `);

    await runAsync(db, `INSERT INTO tickets (number, service, status) VALUES
      ('B123', 1, 'served'),
      ('B124', 1, 'waiting'),
      ('B125', 1, 'waiting'),
      ('B126', 1, 'waiting'),
      ('W123', 2, 'served'),
      ('W124', 2, 'waiting'),
      ('W125', 2, 'waiting'),
      ('S123', 3, 'served'),
      ('S124', 3, 'waiting'),
      ('S125', 3, 'waiting'),
      ('S126', 3, 'waiting'),
      ('S127', 3, 'waiting')
    `);

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
