import { openDatabase } from '../config/db.mjs';
import { validationResult } from 'express-validator';



// Controller Function to Create a New Ticket
export const createTicket = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { serviceType } = req.body;
  const db = openDatabase();
  const currentDate = new Date().toISOString(); // Get current date in ISO format

  db.get(
      `SELECT MAX(number) AS lastTicket FROM tickets WHERE DATE(timestamp) = DATE('now')`,
      (err, row) => {
          if (err) {
              return res.status(500).json({ message: "Error retrieving ticket data." });
          }

          const nextTicketNumber = row.lastTicket ? row.lastTicket + 1 : 1;

          db.run(
              `INSERT INTO tickets (number, status, counter, timestamp)
               VALUES (?, ?, ?, ?)`,
              [
                  nextTicketNumber,
                  'waiting',
                  null, // Counter is null initially
                  currentDate // Use the current date here
              ],
              function (insertErr) {
                  if (insertErr) {
                      return res.status(500).json({ message: "Error creating new ticket." });
                  }

                  res.status(201).json({
                      message: "Ticket created successfully.",
                      ticket: {
                          id: this.lastID,
                          number: nextTicketNumber,
                          status: 'waiting',
                          counter: null,
                          timestamp: currentDate // Use the current date here
                      }
                  });
              }
          );
      }
  );

  db.close();
};

// Remove a ticket from the queue
export const deleteTicket = (req, res) => {
    const { id } = req.params; // Ticket ID from the URL
    const db = openDatabase();

    db.run(
        `DELETE FROM tickets WHERE idTicket = ?`,
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete ticket.' });
            }
            return res.status(200).json({ message: 'Ticket deleted successfully.' });
        }
    );

    

    db.close();
};

// Retrieve details for a specific ticket by its ID
export const getTicketById = (req, res) => {
    const { id } = req.params; // Ticket ID from the URL
    const db = openDatabase();

    db.get(
        `SELECT * FROM tickets WHERE idTicket = ?`,
        [id],
        (err, ticket) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch ticket.' });
            }

            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found.' });
            }

            return res.status(200).json({ ticket });
        }
    );

    db.close();
};

// Retrieve statistics on the ticketing system
export const getTicketStatistics = (req, res) => {
    const db = openDatabase();

    db.all(
        `SELECT 
            COUNT(*) AS totalTickets, 
            SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) AS waitingTickets, 
            SUM(CASE WHEN status = 'called' THEN 1 ELSE 0 END) AS calledTickets 
         FROM tickets`,
        (err, stats) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch ticket statistics.' });
            }

            return res.status(200).json({ statistics: stats[0] });
        }
    );

    db.close();
};

// Retrieve all tickets, regardless of status
export const getAllTickets = (req, res) => {
    const db = openDatabase();

    db.all(
        `SELECT * FROM tickets`,
        (err, tickets) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch all tickets.' });
            }

            return res.status(200).json({ tickets });
        }
    );

    db.close();
};

// Update the status of a specific ticket
export const updateTicketStatus = (req, res) => {
    const { id } = req.params; 
    const { status } = req.body; 
    const db = openDatabase();

    db.run(
        `UPDATE tickets SET status = ? WHERE idTicket = ?`,
        [status, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update ticket status.' });
            }
            return res.status(200).json({ message: 'Ticket status updated successfully.' });
        }
    );

    db.close();
};