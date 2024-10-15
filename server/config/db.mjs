import sqlite3 from 'sqlite3';

// Function to open a SQLite database
export const openDatabase = () => {
    return new sqlite3.Database('queue.sqlite', (err) => {
        if (err) {
            console.error('Error opening database ' + err.message);
        }
    });
};