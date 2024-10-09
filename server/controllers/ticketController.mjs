import { openDatabase } from '../config/db.mjs';


// API to call the next ticket
export const callNextTicket = (req, res) => {
  openDatabase().then((db) => {
    // Find the first waiting ticket (not served)
    db.get(`SELECT * FROM tickets WHERE served = 0 ORDER BY day ASC, idTicket ASC LIMIT 1`, (err, ticket) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving the ticket' });
      }

      if (!ticket) {
        return res.status(404).json({ message: 'No waiting tickets' });
      }

      // Mark the ticket as served
      db.run(`UPDATE tickets SET served = 1 WHERE idTicket = ? AND day = ?`, [ticket.idTicket, ticket.day], function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error updating the ticket' });
        }

        res.status(200).json({ message: 'Ticket called', ticket });
      });
    });
  }).catch((error) => {
    console.error(error);
    res.status(500).json({ message: 'Error opening the database' });
  });
};

// API to insert a new ticket in DB
export const createTicket = (req, res) => {
  openDatabase().then((db) => {
    db.run(`INSERT INTO tickets (idTicket, day, service, counter, served) VALUES
      (?, ?, ?, ?, ?)`, [req.body.idTicket, req.body.day, req.body.service, req.body.counter, req.body.served],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error creating the ticket' });
        }
        res.status(200).json({ message: 'Ticket created' });
      });
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Error opening the database' });
  });
};

// API to retrieve a ticket
export const getTicket = (req, res) => {
  openDatabase().then((db) => {
    db.get(`SELECT * FROM tickets WHERE idTicket = ?`, [req.body.idTicket],
      (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error retrieving the ticket' });
        }
        if (!row) {
          return res.status(404).json({ message: 'Ticket not found' });
        } else {
          res.status(200).json({ message: 'Ticket created', row });
        }
      }
    );
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Error opening the database' });
  });
};