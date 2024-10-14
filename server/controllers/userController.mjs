import { openDatabase } from '../config/db.mjs';
import { hashPassword } from '../utils/hashUtils.mjs';

// Create a new user
export const createUser = (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate request data
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const hashedPassword = hashPassword(password); // Hash the password

    const db = openDatabase();
    
    db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, role],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create user.' });
            }
            return res.status(201).json({ id: this.lastID, name, email, role });
        }
    );

    db.close();
};

// Get all users
export const getAllUsers = (req, res) => {
    const db = openDatabase();

    db.all(`SELECT idUser, name, email, role FROM users`, [], (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch users.' });
        }
        return res.status(200).json(users);
    });

    db.close();
};

// Get user by ID
export const getUserById = (req, res) => {
    const { id } = req.params;
    const db = openDatabase();

    db.get(`SELECT idUser, name, email, role FROM users WHERE idUser = ?`, [id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch user.' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json(user);
    });

    db.close();
};

// Update user
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const db = openDatabase();

    // Prepare the update query
    let query = `UPDATE users SET name = ?, email = ?, role = ?`;
    const params = [name, email, role];

   
    if (password) {
        const hashedPassword = hashPassword(password);
        query += `, password = ?`;
        params.push(hashedPassword);
    }
    
    query += ` WHERE idUser = ?`;
    params.push(id);

    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update user.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({ message: 'User updated successfully.' });
    });

    db.close();
};

// Delete user
export const deleteUser = (req, res) => {
    const { id } = req.params;
    const db = openDatabase();

    db.run(`DELETE FROM users WHERE idUser = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete user.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({ message: 'User deleted successfully.' });
    });

    db.close();
};
