import { getService, getAllServices } from '../controllers/serviceController.mjs';
import { openDatabase } from '../config/db.mjs';

jest.mock('../config/db.mjs'); // Mock the database module

describe('Service Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getService', () => {
        it('should retrieve a service and return 200', async () => {
            req.params.idService = '1';
            const mockService = { idService: 1, name: 'Test Service' };

            const db = {
                get: jest.fn((query, params, callback) => {
                    callback(null, mockService); // Simulate successful retrieval of the service
                }),
                close: jest.fn(),
            };

            openDatabase.mockReturnValue(db);

            await getService(req, res);

            expect(db.get).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM services'),
                ['1'],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Service retrieved', row: mockService });
        });

        it('should return 404 if service not found', async () => {
            req.params.idService = '1';

            const db = {
                get: jest.fn((query, params, callback) => {
                    callback(null, null); // Simulate service not found
                }),
                close: jest.fn(),
            };

            openDatabase.mockReturnValue(db);

            await getService(req, res);

            expect(db.get).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM services'),
                ['1'],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Service not found' });
        });

        it('should return 500 if there is a database error', async () => {
            req.params.idService = '1';

            const db = {
                get: jest.fn((query, params, callback) => {
                    callback(new Error('Database error')); // Simulate a database error
                }),
                close: jest.fn(),
            };

            openDatabase.mockReturnValue(db);

            await getService(req, res);

            expect(db.get).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM services'),
                ['1'],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving the service' });
        });
    });

    describe('getAllServices', () => {
        it('should retrieve all services and return 200', async () => {
            const mockServices = [
                { idService: 1, name: 'Service 1' },
                { idService: 2, name: 'Service 2' },
            ];

            const db = {
                all: jest.fn((query, params, callback) => {
                    callback(null, mockServices); // Simulate successful retrieval of services
                }),
                close: jest.fn(),
            };

            openDatabase.mockReturnValue(db);

            await getAllServices(req, res);

            expect(db.all).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM services'),
                [],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Services list retrieved', rows: mockServices });
        });

        it('should return 404 if there are no services', async () => {
            const db = {
                all: jest.fn((query, params, callback) => {
                    callback(null, []); // Simulate no services found
                }),
                close: jest.fn(),
            };

            openDatabase.mockReturnValue(db);

            await getAllServices(req, res);

            expect(db.all).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM services'),
                [],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'There are no services' });
        });

        it('should return 500 if there is a database error', async () => {
            const db = {
                all: jest.fn((query, params, callback) => {
                    callback(new Error('Database error')); // Simulate a database error
                }),
                close: jest.fn(),
            };

            openDatabase.mockReturnValue(db);

            await getAllServices(req, res);

            expect(db.all).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM services'),
                [],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving services' });
        });
    });
});
