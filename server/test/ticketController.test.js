import { createTicket, deleteTicket, getTicketById, getTicketStatistics, getAllTickets, updateTicketStatus, getNextTicket, getAllWaitingTickets } from '../controllers/ticketController.mjs';
import { openDatabase } from '../config/db.mjs';
import { validationResult } from 'express-validator'; 

jest.mock('../config/db.mjs');

jest.mock('express-validator', () => ({
    validationResult: jest.fn(),
}));

describe('Ticket Controller', () => {
    let mockDb;

    beforeEach(() => {
        
        mockDb = {
            get: jest.fn(),
            run: jest.fn(),
            all: jest.fn(),
            close: jest.fn(),
        };
        
        openDatabase.mockReturnValue(mockDb);
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test('should create a new ticket successfully', async () => {
        validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
        const req = {
            body: {
                service: 1
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.get.mockImplementationOnce((sql, params, callback) => {
            callback(null, { count: 1 });
        });
        mockDb.get.mockImplementationOnce((sql, callback) => {
            callback(null, { lastTicket: 1 });
        });

        mockDb.run.mockImplementationOnce(function (sql, params, callback) {
            callback.call({ lastID: 1 }, null);
        });

        await createTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Ticket created successfully.",
            ticket: {
                id: expect.any(Number),
                service: 1,
                number: 2,
                status: 'waiting',
                counter: null,
                timestamp: expect.any(String),
            },
        }));
    });

    test('should return 404 if service is not in DB', async () => {
        validationResult.mockReturnValue({ isEmpty: jest.fn().mockReturnValue(true) });
        const req = {
            body: {
                service: 5
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.get.mockImplementationOnce((sql, params, callback) => {
            callback(null, { count: 0 });
        });

        await createTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Service not found.' });
    });

    test('should return 400 if validation fails on creating a ticket', async () => {
        validationResult.mockReturnValue({
            isEmpty: jest.fn().mockReturnValue(false),
            array: jest.fn().mockReturnValue([{ msg: 'Service is required' }]), 
        });

        const req = {
            body: {service: null},
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Service is required' }] });
    });

    test('should delete a ticket successfully', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.run.mockImplementationOnce((query, values, callback) => callback(null));

        await deleteTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ticket deleted successfully.' });
    });

    test('should return 500 if delete fails', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.run.mockImplementationOnce((query, values, callback) => callback(new Error('DB Error')));

        await deleteTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete ticket.' });
    });

    test('should get a ticket by ID successfully', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.get.mockImplementationOnce((query, values, callback) => callback(null, { idTicket: 1, service: 'Test Service' }));

        await getTicketById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ ticket: { idTicket: 1, service: 'Test Service' } });
    });

    test('should return 404 if ticket is not found', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.get.mockImplementationOnce((query, values, callback) => callback(null, null));

        await getTicketById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ticket not found.' });
    });

    test('should get ticket statistics successfully', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.all.mockImplementationOnce((query, callback) => callback(null, [{ totalTickets: 10, waitingTickets: 5, calledTickets: 5 }]));

        await getTicketStatistics(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ statistics: { totalTickets: 10, waitingTickets: 5, calledTickets: 5 } });
    });

    test('should get all tickets successfully', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.all.mockImplementationOnce((query, callback) => callback(null, [{ idTicket: 1 }, { idTicket: 2 }]));

        await getAllTickets(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ tickets: [{ idTicket: 1 }, { idTicket: 2 }] });
    });

    test('should update ticket status successfully', async () => {
        const req = { params: { id: 1 }, body: { status: 'served' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.run.mockImplementationOnce((query, values, callback) => callback(null));

        await updateTicketStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ticket status updated successfully.' });
    });

    test('should return 500 if updating ticket status fails', async () => {
        const req = { params: { id: 1 }, body: { status: 'served' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.run.mockImplementationOnce((query, values, callback) => callback(new Error('DB Error')));

        await updateTicketStatus(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update ticket status.' });
    });

    test('should get the next ticket successfully', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.get.mockImplementationOnce((query, callback) => callback(null, { idTicket: 1, service: 'Test Service' }));

        await getNextTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ ticket: { idTicket: 1, service: 'Test Service' } });
    });

    test('should return 404 if no waiting tickets are available', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.get.mockImplementationOnce((query, callback) => callback(null, null));

        await getNextTicket(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No waiting tickets available.' });
    });

    test('should get all waiting tickets successfully', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.all.mockImplementationOnce((query, callback) => callback(null, [{ idTicket: 1 }, { idTicket: 2 }]));

        await getAllWaitingTickets(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ tickets: [{ idTicket: 1 }, { idTicket: 2 }] });
    });

    test('should return 500 if fetching waiting tickets fails', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.all.mockImplementationOnce((query, callback) => callback(new Error('DB Error')));

        await getAllWaitingTickets(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch waiting tickets.' });
    });
});
