import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.mjs';
import { openDatabase } from '../config/db.mjs';
import { hashPassword } from '../utils/hashUtils.mjs';

jest.mock('../config/db.mjs');
jest.mock('../utils/hashUtils.mjs');

describe('User Controller', () => {
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

    // Test for createUser
    test('should create a new user successfully', async () => {
        const req = {
            body: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'Manager'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        hashPassword.mockReturnValue('hashedPassword123');
        mockDb.run.mockImplementationOnce(function(query, values, callback) {
            callback.call({ lastID: 1 }, null);  
        });
        
        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Manager'
        });
    });

    test('should return 400 if required fields are missing when creating a user', async () => {
        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required.' });
    });

    test('should return 500 if database error occurs while creating a user', async () => {
        const req = {
            body: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        hashPassword.mockReturnValue('hashedPassword123');
        mockDb.run.mockImplementationOnce((query, values, callback) => callback(new Error('DB Error')));

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create user.' });
    });

    // Test for getAllUsers
    test('should fetch all users successfully', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.all.mockImplementationOnce((query,values, callback) => callback(null, [{ idUser: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Manager' }]));

        await getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ idUser: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Manager' }]);
    });

    test('should return 500 if database error occurs while fetching all users', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.all.mockImplementationOnce((query, values, callback) => callback(new Error('DB Error')));

        await getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch users.' });
    });

    // Test for getUserById
    test('should fetch user by ID successfully', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.get.mockImplementationOnce((query, values, callback) => callback(null, { idUser: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'user' }));

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ idUser: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'user' });
    });

    test('should return 404 if user not found by ID', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.get.mockImplementationOnce((query, values, callback) => callback(null, null));

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    // Test for updateUser
    test('should update a user successfully', async () => {
        const req = { params: { id: 1 }, body: { name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Officer' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        

        mockDb.run.mockImplementationOnce(function(query, values, callback) {
          
            callback.call({changes:1}, null);  
        });
    

    await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully.' });
    });

    test('should return 404 if user not found when updating', async () => {
        const req = { params: { id: 1 }, body: { name: 'Jane Doe', email: 'jane.doe@example.com', role: 'admin' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.run.mockImplementationOnce(function(query, values, callback) {callback.call({ changes: 0 }, null);});

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    // Test for deleteUser
    test('should delete a user successfully', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.run.mockImplementationOnce(function(query, values, callback){ callback.call({changes:1},null)});

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully.' });
    });

    test('should return 404 if user not found when deleting', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockDb.run.mockImplementationOnce(function(query, values, callback) {callback.call({ changes: 0 }, null)});

        await deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });
});
