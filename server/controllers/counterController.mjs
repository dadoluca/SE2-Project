import { openDatabase } from '../config/db.mjs';

// API to retrieve all counters
export const getAllCounters = (req, res) => {
  const db = openDatabase();
      db.all(`SELECT * FROM counters`, [],
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving counters' });
          }
          if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'There are no counters' });
          } else {
            res.status(200).json({ message: 'Counters list retrieved', rows });
          }
        }
      );
  db.close();
};

// API to retrieve a counter's services
export const getCounterServices = (req, res) => {
  const db = openDatabase();
      db.all(`SELECT service FROM serviceForCounter WHERE counter = ?`, [req.params.idCounter],
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving the list' });
          }
          if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'This counter has no services' });
          } else {
            res.status(200).json({ message: 'Counter services list retrieved', rows });
          }
        }
      );
  db.close();
};