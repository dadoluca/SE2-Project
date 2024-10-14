import { openDatabase } from '../config/db.mjs';

export const callNextTicket = (req, res) => {
    const { counterId } = req.body; // Counter requesting the next ticket
    const db = openDatabase(); // Open the database connection

    // Start a transaction to ensure atomic operation
    db.serialize(() => {
        db.get(
            `SELECT * FROM tickets WHERE status = 'waiting' ORDER BY timestamp ASC LIMIT 1`,
            (err, ticket) => {
                if (err) {
                    db.close(); // Close DB connection on error
                    return res.status(500).json({ error: 'Failed to fetch the next ticket.' });
                }

                if (!ticket) {
                    db.close(); // Close DB connection if no ticket found
                    return res.status(404).json({ message: 'No waiting tickets available.' });
                }

                // Update ticket status to 'called' and assign counter ID
                db.run(
                    `UPDATE tickets SET status = 'called', counter = ? WHERE id = ?`,
                    [counterId, ticket.id],
                    function (updateErr) {
                        if (updateErr) {
                            db.close(); // Close DB connection on update error
                            return res.status(500).json({ error: 'Failed to update ticket status.' });
                        }

                        // Send success response
                        return res.status(200).json({
                            message: 'Next ticket called successfully.',
                            ticket: { ...ticket, status: 'called', counter: counterId }
                        });
                    }
                );
            }
        );
    });

    // Close the database connection after all operations are done
    db.close();
};


export const serveTicket = (req, res) => {
    const { ticketId } = req.body;
    const db = openDatabase();

    db.run(
        `UPDATE tickets SET status = 'served' WHERE id = ?`,
        [ticketId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to serve the ticket.' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ message: 'Ticket not found.' });
            }

            return res.status(200).json({ message: 'Ticket served successfully.' });
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

// Assign a waiting ticket to a specific counter
export const assignTicketToCounter = (req, res) => {
    const { id } = req.params; // Ticket ID from the URL
    const { counterId } = req.body; // Counter ID from the request body
    const db = openDatabase();

    db.run(
        `UPDATE tickets SET counter = ? WHERE idTicket = ?`,
        [counterId, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to assign ticket to counter.' });
            }
            return res.status(200).json({ message: 'Ticket assigned to counter successfully.' });
        }
    );

    db.close();
};

// Clear all tickets from the queue and reset the statuses
export const resetQueue = (req, res) => {
    const db = openDatabase();

    db.run(
        `DELETE FROM tickets`,
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to reset queue.' });
            }
            return res.status(200).json({ message: 'Queue reset successfully.' });
        }
    );

    db.close();
};