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
