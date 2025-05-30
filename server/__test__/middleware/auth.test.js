const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../../middleware/auth');
const { User } = require('../../models');
const { generateToken } = require('../../helpers/jwt');

// Mock the User model
jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';

describe('Authentication Middleware', () => {
  let app;
  let mockUser;

  beforeEach(() => {
    // Create Express app for testing
    app = express();
    app.use(express.json());
    
    // Test route that uses authentication middleware
    app.get('/protected', authenticate, (req, res) => {
      res.json({ message: 'Access granted', user: req.user });
    });

    // Mock user data based on project structure
    mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Valid Token Tests', () => {
    it('should authenticate user with valid token', async () => {
      // Mock User.findByPk to return a user
      User.findByPk.mockResolvedValue(mockUser);
      
      // Generate valid token
      const token = generateToken({ id: mockUser.id });
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Access granted');
      expect(response.body.user).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);
    });

    it('should authenticate user with different user ID', async () => {
      const anotherUser = {
        id: 2,
        username: 'anotheruser',
        email: 'another@example.com',
        password: 'hashedpassword2'
      };
      
      User.findByPk.mockResolvedValue(anotherUser);
      const token = generateToken({ id: anotherUser.id });
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(anotherUser);
      expect(User.findByPk).toHaveBeenCalledWith(anotherUser.id);
    });
  });

  describe('Missing Token Tests', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const response = await request(app)
        .get('/protected');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
      expect(User.findByPk).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is empty', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', '');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
      expect(User.findByPk).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header has no Bearer token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
      expect(User.findByPk).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header has wrong format', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'InvalidFormat token123');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
      expect(User.findByPk).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Token Tests', () => {
    it('should return 401 for malformed token', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalid.token.here');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
      expect(User.findByPk).not.toHaveBeenCalled();
    });

    it('should return 401 for expired token', async () => {
      // Create expired token
      const expiredToken = jwt.sign(
        { id: mockUser.id, exp: Math.floor(Date.now() / 1000) - 3600 }, // 1 hour ago
        process.env.JWT_SECRET
      );
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
      expect(User.findByPk).not.toHaveBeenCalled();
    });

    it('should return 401 for token with wrong secret', async () => {
      const wrongSecretToken = jwt.sign(
        { id: mockUser.id },
        'wrong-secret'
      );
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${wrongSecretToken}`);
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
      expect(User.findByPk).not.toHaveBeenCalled();
    });

    it('should return 401 for completely invalid token string', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer notavalidtoken');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
      expect(User.findByPk).not.toHaveBeenCalled();
    });
  });

  describe('User Not Found Tests', () => {
    it('should return 401 when user does not exist in database', async () => {
      // Mock User.findByPk to return null (user not found)
      User.findByPk.mockResolvedValue(null);
      
      const token = generateToken({ id: 999 }); // Non-existent user ID
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
      expect(User.findByPk).toHaveBeenCalledWith(999);
    });

    it('should return 401 when database query fails', async () => {
      // Mock User.findByPk to throw an error
      User.findByPk.mockRejectedValue(new Error('Database connection failed'));
      
      const token = generateToken({ id: mockUser.id });
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('Token Payload Tests', () => {
    it('should handle token with additional payload data', async () => {
      User.findByPk.mockResolvedValue(mockUser);
      
      const token = generateToken({ 
        id: mockUser.id, 
        username: mockUser.username,
        role: 'user'
      });
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);
    });

    it('should handle token with missing id field', async () => {
      const tokenWithoutId = jwt.sign(
        { username: 'testuser' },
        process.env.JWT_SECRET
      );
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${tokenWithoutId}`);
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('Authorization Header Variations', () => {
    it('should handle Bearer token with extra spaces', async () => {
      User.findByPk.mockResolvedValue(mockUser);
      const token = generateToken({ id: mockUser.id });
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer  ${token}  `);
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    it('should handle lowercase bearer', async () => {
      User.findByPk.mockResolvedValue(mockUser);
      const token = generateToken({ id: mockUser.id });
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `bearer ${token}`);
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('Middleware Integration Tests', () => {
    it('should call next() and continue to route handler on successful authentication', async () => {
      User.findByPk.mockResolvedValue(mockUser);
      const token = generateToken({ id: mockUser.id });
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Access granted');
      expect(response.body.user).toEqual(mockUser);
    });

    it('should not call next() on authentication failure', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
      expect(response.body.message).toBeUndefined();
    });
  });

  describe('Real User Data Tests', () => {
    it('should authenticate with realistic user data from seeders', async () => {
      const realisticUser = {
        id: 1,
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: '$2b$10$hashedpasswordhere'
      };
      
      User.findByPk.mockResolvedValue(realisticUser);
      const token = generateToken({ id: realisticUser.id });
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe('john_doe');
      expect(response.body.user.email).toBe('john.doe@example.com');
    });

    it('should handle multiple concurrent authentication requests', async () => {
      const users = [
        { id: 1, username: 'user1', email: 'user1@example.com' },
        { id: 2, username: 'user2', email: 'user2@example.com' },
        { id: 3, username: 'user3', email: 'user3@example.com' }
      ];
      
      // Mock different responses for different user IDs
      User.findByPk.mockImplementation((id) => {
        return Promise.resolve(users.find(user => user.id === id));
      });
      
      const tokens = users.map(user => generateToken({ id: user.id }));
      
      const requests = tokens.map(token => 
        request(app)
          .get('/protected')
          .set('Authorization', `Bearer ${token}`)
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.body.user.username).toBe(users[index].username);
      });
    });
  });
});