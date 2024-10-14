import { openDatabase } from '../config/db.mjs';


// API to call the next ticket
export const callNextTicket = (req, res) => {
  const serviceId = req.query.serviceId;
  openDatabase().then((db) => {
    const query = `SELECT * FROM tickets WHERE served = 0` + (serviceId ? ` AND service = ?` : '') + ` ORDER BY day ASC, idTicket ASC LIMIT 1`;
    
    db.get(query, serviceId ? [serviceId] : [], (err, ticket) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving the ticket' });
      }

      if (!ticket) {
        return res.status(404).json({ message: 'No waiting tickets' });
      }
      markTicketAsCalled(db, ticket, res);
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
    db.get(`SELECT * FROM tickets WHERE idTicket = ?`, [req.params.id],
      (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error retrieving the ticket' });
        }
        if (!row) {
          return res.status(404).json({ message: 'Ticket not found' });
        } else {
          res.status(200).json({ message: 'Ticket retrieved', row });
        }
      }
    );
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Error opening the database' });
  });
};

//API to retrieve ticket history
export const getTicketHistory = (req, res) => {
  const { startDate, endDate, serviceId, counterId} = req.query;

  openDatabase(). then((db) =>{
    let query = 'SELECT * FROM tickets WHERE day BETWEEN ? AND ?';
    let params = [startDate, endDate];

    db.all(query, params, (err, rows) => {
      if(err){
        console.error(err);
        return res.status(500).json({ message: 'Error retriving ticket history'});
      }
      
      if (rows.length === 0){
        return res.status(404).json ({ message: 'no tickets found for the specified period'});
      }
  
      res.status(200).json({ tickets: rows});
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Error opening the database'});
  }) ;

};

 //API to mark a ticket as served
 export const serveTicket =(req, res) => {
  const {idTicket} = req.body;
  console.log('Received request to serve ticket:', idTicket);

  if(!idTicket){
    return res.status(400).json({ message: 'Ticket ID is required.'});
  }
  openDatabase().then((db) => {
    const query = 'UPDATE tickets SET served = 1 WHERE idTicket = ?';
    db.run(query, [idTicket], function(err) {
      if(err) {
        console.error('Database error:', err);
        return res.status(500).json({message: 'Error marking the ticket as served.'});
      }
      console.log('Number of tickets updated:', this.changes);
      if (this.changes === 0){
        return res.status(404).json({message:'Ticket nor found.'});
      }
      res.status(200).json({message: 'Ticket marked as saved.'});
    });
  }).catch((err)=>{
    console.error('Database opening error:', err);
    res.status(500).json({ message:'Error opening the database.'});
  });
};