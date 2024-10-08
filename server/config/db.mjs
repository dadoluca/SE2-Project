import sqlite3 from 'sqlite3';

export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./queue.sqlite', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
};
