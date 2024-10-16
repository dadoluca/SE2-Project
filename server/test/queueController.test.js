import {
    callNextTicket,
    serveTicket,
    assignTicketToCounter,
    resetQueue,
    getQueuesData,
    callNextFromLongestQueue
} from '../controllers/queueController.mjs';
import { openDatabase } from '../config/db.mjs';

// Mocking the database connection
jest.mock('../config/db.mjs');

describe('Queue Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the database connection
        openDatabase.mockReturnValue({
            serialize: jest.fn((callback) => callback()),
            get: jest.fn((query, params, callback) => callback(null, null)),
            run: jest.fn((query, params, callback) => callback(null)),
            all: jest.fn((query, params, callback) => callback(null, [])),
            close: jest.fn(),
        });
    });

    describe('callNextTicket', () => {
        let req, res;
    
        beforeEach(() => {
            req = {
                body: { counterId: 1 },
            };
    
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
        });
    
        it('should call the next ticket successfully', async () => {
            const ticket = { id: 1, service: 'Test Service', status: 'waiting' };
    
            openDatabase.mockReturnValueOnce({
                serialize: jest.fn((callback) => {
                    // Invoke the callback immediately to simulate serialization
                    callback(); // Call serialize callback
                }),
                get: jest.fn((query, params, callback) => {
                    // Simulate getting the ticket from the database
                    if (typeof callback === 'function') {
                        callback(null, ticket); // Pass the ticket as the second argument
                    }
                }),
                run: jest.fn((query, params, callback) => {
                    // Simulate a successful update
                    if (typeof callback === 'function') {
                        callback(null); // No error in the update
                    }
                }),
                close: jest.fn(),
            });
    
            await callNextTicket(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Next ticket called successfully.',
                ticket: { ...ticket, status: 'called', counter: 1 },
            });
        });
    
        it('should return 404 if no waiting tickets are available', async () => {
            openDatabase.mockReturnValueOnce({
                serialize: jest.fn((callback) => {
                    callback(); // Call serialize callback
                }),
                get: jest.fn((query, params, callback) => {
                    if (typeof callback === 'function') {
                        callback(null, null); // No ticket found
                    }
                }),
                close: jest.fn(),
            });
    
            await callNextTicket(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'No waiting tickets available.' });
        });
    
        it('should return 500 if fetching the next ticket fails', async () => {
            openDatabase.mockReturnValueOnce({
                serialize: jest.fn((callback) => {
                    callback(); // Call serialize callback
                }),
                get: jest.fn((query, params, callback) => {
                    if (typeof callback === 'function') {
                        callback(new Error('DB Error')); // Simulating database error
                    }
                }),
                close: jest.fn(),
            });
    
            await callNextTicket(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch the next ticket.' });
        });
    
        it('should return 500 if updating ticket status fails', async () => {
            const ticket = { id: 1, service: 'Test Service', status: 'waiting' };
            openDatabase.mockReturnValueOnce({
                serialize: jest.fn((callback) => {
                    callback(); // Call serialize callback
                }),
                get: jest.fn((query, params, callback) => {
                    if (typeof callback === 'function') {
                        callback(null, ticket); // Ticket found
                    }
                }),
                run: jest.fn((query, params, callback) => {
                    if (typeof callback === 'function') {
                        callback(new Error('Update Error')); // Simulating update error
                    }
                }),
                close: jest.fn(),
            });
    
            await callNextTicket(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update ticket status.' });
        });
    });
    
    
    

    describe('serveTicket', () => {
        let req, res;
    
        beforeEach(() => {
            req = {
                body: { ticketId: 1 }, // Modify according to your needs
            };
    
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
        });
    
        it('should return 404 if the ticket is not found', async () => {
            openDatabase.mockReturnValueOnce({
                run: jest.fn(function (query, params, callback) {
                    // Maintain the context for `this`
                    this.changes = 0; // Simulating that no ticket was updated
                    callback(null); // Call the callback with no error
                }),
                close: jest.fn(),
            });
    
            await serveTicket(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Ticket not found.' });
        });
    
        it('should return 500 if serving fails', async () => {
            openDatabase.mockReturnValueOnce({
                run: jest.fn(function (query, params, callback) {
                    callback(new Error('DB Error')); // Simulate a database error
                }),
                close: jest.fn(),
            });
    
            await serveTicket(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to serve the ticket.' });
        });
    
        it('should serve the ticket successfully', async () => {
            openDatabase.mockReturnValueOnce({
                run: jest.fn(function (query, params, callback) {
                    this.changes = 1; // Simulating a successful ticket serving
                    callback(null); // Call the callback with no error
                }),
                close: jest.fn(),
            });
    
            await serveTicket(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Ticket served successfully.' });
        });
    });
    
    
    

    describe('assignTicketToCounter', () => {
        it('should assign the ticket to a counter successfully', async () => {
            req.params.id = 1;
            req.body.counterId = 2;

            await assignTicketToCounter(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Ticket assigned to counter successfully.' });
        });

        it('should return 500 if assigning fails', async () => {
            req.params.id = 1;
            req.body.counterId = 2;

            openDatabase.mockReturnValueOnce({
                run: jest.fn((query, params, callback) => callback(new Error('DB Error'))),
                close: jest.fn(),
            });

            await assignTicketToCounter(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to assign ticket to counter.' });
        });
    });

    describe('resetQueue', () => {
        it('should reset the queue successfully', async () => {
            openDatabase.mockReturnValueOnce({
                run: jest.fn((query, callback) => callback(null)), // Corrected: Only passing the callback
                close: jest.fn(),
            });
    
            await resetQueue(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Queue reset successfully.' });
        });
    
        it('should return 500 if resetting fails', async () => {
            openDatabase.mockReturnValueOnce({
                run: jest.fn((query, callback) => callback(new Error('DB Error'))), // Corrected: Only passing the callback
                close: jest.fn(),
            });
    
            await resetQueue(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to reset queue.' });
        });
    });
    
    

    describe('getQueuesData', () => {
        it('should retrieve queues data successfully', async () => {
            const rows = [
                { serviceName: 'Service 1', idTicket: 1, iconPath: 'icon1.png' },
                { serviceName: 'Service 2', idTicket: 2, iconPath: 'icon2.png' },
            ];
            openDatabase.mockReturnValueOnce({
                all: jest.fn((query, params, callback) => callback(null, rows)),
                close: jest.fn(),
            });

            await getQueuesData(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Queues retrieved',
                services: expect.any(Array),
            });
        });

        it('should return 404 if no queues are found', async () => {
            openDatabase.mockReturnValueOnce({
                all: jest.fn((query, params, callback) => callback(null, [])),
                close: jest.fn(),
            });

            await getQueuesData(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'There are no queues' });
        });

        it('should return 500 if fetching queues fails', async () => {
            openDatabase.mockReturnValueOnce({
                all: jest.fn((query, params, callback) => callback(new Error('DB Error'))),
                close: jest.fn(),
            });

            await getQueuesData(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving queues' });
        });
    });
});

describe('callNextFromLongestQueue', () => {
    let req, res;

    beforeEach(() => {
        req = {}; // No specific request body needed for this endpoint
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should call the next ticket from the longest queue successfully', async () => {
        const ticket = { id: 2, service: 'bill payment' }; // Sample ticket object
    
        // Mocking the database
        openDatabase.mockReturnValueOnce({
            // This will mock the 'all' function for getting the longest queue
            all: jest.fn((query, params, callback) => {
                // Simulate fetching the longest queue with tickets
                callback(null, [[ticket]]); // Return the longest queue with tickets
            }),
            // This will mock the 'get' function for retrieving the first waiting ticket
            get: jest.fn((query, params, callback) => {
                // Simulate getting a specific waiting ticket
                callback(null, ticket); // Return the ticket as if it's found
            }),
            run: jest.fn((query, params, callback) => {
                callback(null); // Simulate a successful update
            }),
            close: jest.fn(),
        });
    
        await callNextFromLongestQueue(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ 
            message: 'Next ticket called successfully.', // Ensure this message is correct
            ticket 
        });
    });
    
    

    it('should return 404 if no waiting tickets are found', async () => {
        openDatabase.mockReturnValueOnce({
            all: jest.fn((query, params, callback) => {
                // Simulate no waiting tickets found
                callback(null, []); // Return an empty array
            }),
            close: jest.fn(),
        });
    
        await callNextFromLongestQueue(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No tickets in any queue.' }); // Updated expected message
    });
    

    it('should return 500 if there is an error during database query', async () => {
        openDatabase.mockReturnValueOnce({
            all: jest.fn((query, params, callback) => {
                callback(new Error('Database error')); // Simulate database error
            }),
            close: jest.fn(),
        });
    
        await callNextFromLongestQueue(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve queue information.' });
    });
});
