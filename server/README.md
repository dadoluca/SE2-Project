# Express.js Backend for Queue WebApp

## Project Structure
This project is an Express.js backend that manages queues for a ticketing system. It provides routes for calling and serving tickets, assigning tickets to counters, resetting queues, and more.

## Getting Started

To run the project locally, follow these steps:

### 1. Install Dependencies
Install the required dependencies with the following command:
```bash
npm install
```

### 2. Initialize the Database
If this is your first time running the project, initialize the database by executing:
```bash
node init_db.mjs
```

### 3. Start the Server
Start the server with:
```bash
nodemon server.mjs
```

### 4. Run Tests
To run tests, first install Jest if needed:
```bash
npm install --save-dev jest
```
Then, execute the tests:
```bash
npx jest
```

