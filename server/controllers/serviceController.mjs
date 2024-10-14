import { openDatabase } from '../config/db.mjs';

// API to retrieve a service
export const getService = (req, res) => {
    openDatabase().then((db) => {
      db.get(`SELECT * FROM services WHERE idService = ?`, [req.params.idService],
        (err, row) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving the service' });
          }
          if (!row) {
            return res.status(404).json({ message: 'Service not found' });
          } else {
            res.status(200).json({ message: 'Service retrieved', row });
          }
        }
      );
    }).catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Error opening the database' });
    });
};

// API to retrieve all services
export const getAllServices = (req, res) => {
    openDatabase().then((db) => {
      db.all(`SELECT * FROM services`, [],
        (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving services' });
          }
          if (!rows) {
            return res.status(404).json({ message: 'There are no services' });
          } else {
            res.status(200).json({ message: 'Services list retrieved', rows });
          }
        }
      );
    }).catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Error opening the database' });
    });
};