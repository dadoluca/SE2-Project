import { openDatabase } from '../config/db.mjs';
import { validationResult } from 'express-validator';



// Controller Function to Create a New Ticket
export const createTicket = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const serviceType = req.body.service;
    const db = openDatabase();
    const currentDate = new Date().toISOString();

    try {
        const serviceRow = await new Promise((resolve, reject) => {
            db.get(
                `SELECT COUNT(*) AS count FROM services WHERE idService = ?`,
                [serviceType],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                }
            );
        });

        if (!serviceRow || serviceRow.count === 0) {
            return res.status(404).json({ message: "Service not found." });
        }

        const serviceLetter = String.fromCharCode(65 + (serviceType - 1)); // 65 is ASCII for A

        const lastTicketRow = await new Promise((resolve, reject) => {
            db.get(
                `SELECT MAX(CAST(SUBSTR(number, 2) AS INTEGER)) AS lastTicket 
                 FROM tickets 
                 WHERE strftime('%Y-%m-%d', timestamp) = DATE('now') 
                 AND SUBSTR(number, 1, 1) = ?`,
                [serviceLetter],
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                }
            );
        });

        const nextTicketNumber = lastTicketRow.lastTicket ? lastTicketRow.lastTicket + 1 : 100;

        const ticketCode = `${serviceLetter}${nextTicketNumber}`;

        const id = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO tickets (idTicket, number, service, status, counter, timestamp)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [null, ticketCode, serviceType, 'waiting', null, currentDate],
                function (insertErr) {
                    if (insertErr) return reject(insertErr);
                    resolve(this.lastID);
                }
            );
        });

        res.status(201).json({
            message: "Ticket created successfully.",
            ticket: {
                id: id,
                service: serviceType,
                number: ticketCode,
                status: 'waiting',
                counter: null,
                timestamp: currentDate 
            }
        });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ message: "Internal server error." });
    } finally {
        db.close();
    }
};

// Remove a ticket from the queue
export const deleteTicket = (req, res) => {
    const { id } = req.params; 
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
    const { id } = req.params; 
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

// Retrieve the next waiting ticket without calling it
export const getNextTicket = (req, res) => {
    const db = openDatabase();

    db.get(
        `SELECT * FROM tickets WHERE status = 'waiting' ORDER BY timestamp ASC LIMIT 1`,
        (err, ticket) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch the next ticket.' });
            }

            if (!ticket) {
                return res.status(404).json({ message: 'No waiting tickets available.' });
            }

            return res.status(200).json({ ticket });
        }
    );

    db.close();
};

// Retrieve all tickets currently in the "waiting" status
export const getAllWaitingTickets = (req, res) => {
    const db = openDatabase();

    db.all(
        `SELECT * FROM tickets WHERE status = 'waiting'`,
        (err, tickets) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch waiting tickets.' });
            }

            return res.status(200).json({ tickets });
        }
    );

    db.close();
};