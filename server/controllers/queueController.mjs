import { openDatabase } from '../config/db.mjs';

// API to retrieve all queues
/* Example data:
{
  "message": "Queues retrieved",
  "services": [
    {
      "title": "Service1",
      "serving": "B123",
      "queue": ["B123", "B124", "B125"]
    },
    {
      "title": "Service2",
      "serving": "A100",
      "queue": ["A100", "A101", "A102"]
    }
  ]
} */
export const getQueuesData = (req, res) => {
  openDatabase().then((db) => {
    db.all(`SELECT serviceName, idTicket FROM tickets, services WHERE service = idService AND day = DATE('now') ORDER BY idTicket ASC LIMIT 4`, [],
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
            const { serviceName, idTicket } = row;

            let service = services.find(s => s.title === serviceName);

            if (!service) {
              service = {
                title: serviceName,
                serving: idTicket, // first ticket in queue
                queue: []
              };
              services.push(service);
            }

            service.queue.push(idTicket);

            res.status(200).json({ message: 'Queues retrieved', services: services });
          });
        }
      }
    );
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Error opening the database' });
  });
};