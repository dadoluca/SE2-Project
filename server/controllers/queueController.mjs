import { openDatabase } from '../config/db.mjs';

export const callNextTicket = (req, res) => {
    const { counterId } = req.body; 
    const db = openDatabase(); 

    db.serialize(() => {
        db.get(
            `SELECT * FROM tickets WHERE status = 'waiting' ORDER BY timestamp ASC LIMIT 1`,
            (err, ticket) => {
                if (err) {
                    db.close(); 
                    return res.status(500).json({ error: 'Failed to fetch the next ticket.' });
                }

                if (!ticket) {
                    db.close();
                    return res.status(404).json({ message: 'No waiting tickets available.' });
                }

                
                db.run(
                    `UPDATE tickets SET status = 'called', counter = ? WHERE id = ?`,
                    [counterId, ticket.id],
                    function (updateErr) {
                        if (updateErr) {
                            db.close(); 
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




// Assign a waiting ticket to a specific counter
export const assignTicketToCounter = (req, res) => {
    const { id } = req.params; 
    const { counterId } = req.body;
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