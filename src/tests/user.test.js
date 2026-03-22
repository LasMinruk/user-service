const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

// Mock the User model — no real DB needed
jest.mock('../models/User');

// ─────────────────────────────────────────────────────────
// Sample test data
// ─────────────────────────────────────────────────────────
const sampleUser = {
  _id: '64f1a2b3c4d5e6f7a8b9c0d1',
  name: 'Alice Fernando',
  email: 'alice@example.com',
  createdAt: '2026-01-01T00:00:00.000Z'
};

const validPayload = {
  name: 'Alice Fernando',
  email: 'alice@example.com'
};

// ─────────────────────────────────────────────────────────
// GET /health
// ─────────────────────────────────────────────────────────
describe('GET /health', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.service).toBe('user-service');
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────
// GET /users
// ─────────────────────────────────────────────────────────
describe('GET /users', () => {
  it('should return all users successfully', async () => {
    User.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([sampleUser])
    });

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data).toHaveLength(1);
  });

  it('should return empty array when no users exist', async () => {
    User.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([])
    });

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toHaveLength(0);
  });

  it('should return 500 when database throws error', async () => {
    User.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('DB error'))
    });

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// GET /users/:id
// ─────────────────────────────────────────────────────────
describe('GET /users/:id', () => {
  it('should return a single user by ID', async () => {
    User.findById.mockResolvedValue(sampleUser);

    const res = await request(app).get('/users/64f1a2b3c4d5e6f7a8b9c0d1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe('64f1a2b3c4d5e6f7a8b9c0d1');
  });

  it('should return 404 when user is not found', async () => {
    User.findById.mockResolvedValue(null);

    const res = await request(app).get('/users/64f1a2b3c4d5e6f7a8b9c0d9');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not found');
  });

  it('should return 404 for invalid ObjectId format', async () => {
    const castError = new Error('Cast error');
    castError.name = 'CastError';
    User.findById.mockRejectedValue(castError);

    const res = await request(app).get('/users/invalid-id');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 500 when database throws error', async () => {
    User.findById.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/users/64f1a2b3c4d5e6f7a8b9c0d1');
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// POST /users
// ─────────────────────────────────────────────────────────
describe('POST /users', () => {
  it('should create a user successfully', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(sampleUser);

    const res = await request(app).post('/users').send(validPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User created successfully');
    expect(res.body.data.name).toBe('Alice Fernando');
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app).post('/users').send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Please provide name and email');
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app).post('/users').send({ name: 'Test User' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Please provide name and email');
  });

  it('should return 400 when email already exists', async () => {
    User.findOne.mockResolvedValue(sampleUser);

    const res = await request(app).post('/users').send(validPayload);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User with this email already exists');
  });

  it('should return 500 when database throws error', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockRejectedValue(new Error('DB write error'));

    const res = await request(app).post('/users').send(validPayload);
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// Unknown routes
// ─────────────────────────────────────────────────────────
describe('Unknown routes', () => {
  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Route not found');
  });
});
