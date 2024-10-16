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
                        db.close(); // Move db.close() here to ensure it's called after all operations.
                        if (updateErr) {
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
};



export const serveTicket = (req, res) => {
    const { ticketId } = req.body;
    const db = openDatabase();

    db.run(
        `UPDATE tickets SET status = 'served' WHERE id = ?`,
        [ticketId],
        function (err) { // Use function to maintain context of 'this'
            if (err) {
                return res.status(500).json({ error: 'Failed to serve the ticket.' });
            }

            if (this.changes === 0) { // 'this' refers to the context of the run method
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

// API to retrieve all queues
export const getQueuesData = (req, res) => {
    const db = openDatabase();

    db.all(`SELECT serviceName, number, icon
        FROM tickets JOIN services ON tickets.service = services.idService
        WHERE strftime('%Y-%m-%d', timestamp) = DATE('now') ORDER BY timestamp ASC LIMIT 12`, [], 
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error retrieving queues' });
            }
            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'There are no queues' });
            } else {
                const services = [];

                rows.forEach(row => {
                    const { serviceName, number, icon } = row;

                    let service = services.find(s => s.title === serviceName);

                    if (!service) {
                        // If the service does not exist, create it and set the first ticket as 'serving'                        
                        service = {
                            title: serviceName,
                            icon: icon,
                            serving: number, // First ticket 
                            queue: []
                        };
                        services.push(service);
                    } else {
                    // Add only subsequent tickets to 'queue'
                        service.queue.push({ number: number });
                    }
                });

                return res.status(200).json({ services });
            }
        }
    );

    db.close();
};

// Call the next ticket from the longest queue
export const callNextFromLongestQueue = (req, res) => {
    const db = openDatabase();

    // Step 1: Fetch the number of waiting tickets per service
    db.all(
        `SELECT service, COUNT(*) as count 
         FROM tickets 
         WHERE status = 'waiting' 
         GROUP BY service 
         ORDER BY count DESC 
         LIMIT 1`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to retrieve queue information.' });
            }

            // Step 2: Check if there is any service with waiting tickets
            if (rows.length === 0) {
                return res.status(404).json({ message: 'No tickets in any queue.' });
            }

            const { service } = rows[0];

            // Step 3: Fetch the first waiting ticket from the service with the longest queue
            db.get(
                `SELECT * FROM tickets 
                 WHERE status = 'waiting' AND service = ? 
                 ORDER BY created_at ASC 
                 LIMIT 1`,
                [service],
                (err, ticket) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to fetch the next ticket.' });
                    }

                    if (!ticket) {
                        return res.status(404).json({ message: 'No waiting tickets available.' });
                    }

                    // Step 4: Update the ticket status to "called"
                    db.run(
                        `UPDATE tickets SET status = 'called' WHERE id = ?`,
                        [ticket.id],
                        function (err) {
                            if (err) {
                                return res.status(500).json({ error: 'Failed to update ticket status.' });
                            }

                            return res.status(200).json({
                                message: 'Next ticket called successfully.',
                                ticket: ticket,
                            });
                        }
                    );
                }
            );
        }
    );

    db.close();
};