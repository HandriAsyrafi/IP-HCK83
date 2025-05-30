const request = require('supertest');
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const AuthController = require('../../controllers/authController');
const { User } = require('../../models');
const { generateToken } = require('../../helpers/jwt');
const { comparePassword } = require('../../helpers/bcrypt');

// Mock dependencies
jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  }
}));

jest.mock('../../helpers/jwt', () => ({
  generateToken: jest.fn()
}));

jest.mock('../../helpers/bcrypt', () => ({
  comparePassword: jest.fn()
}));

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn()
  }))
}));

// Mock environment variables
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.JWT_SECRET = 'test-jwt-secret';

describe('AuthController', () => {
  let app;
  let mockClient;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Setup routes
    app.post('/auth/google', AuthController.googleLogin);
    app.post('/auth/login', AuthController.login);
    
    // Mock OAuth2Client instance
    mockClient = {
      verifyIdToken: jest.fn()
    };
    OAuth2Client.mockImplementation(() => mockClient);
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Google Login', () => {
    const mockGooglePayload = {
      email: 'test@gmail.com',
      name: 'Test User',
      sub: 'google-user-id-123'
    };

    const mockTicket = {
      getPayload: () => mockGooglePayload
    };

    it('should login existing user with Google', async () => {
      const existingUser = {
        id: 1,
        email: 'test@gmail.com',
        username: 'testuser'
      };
      
      mockClient.verifyIdToken.mockResolvedValue(mockTicket);
      User.findOne.mockResolvedValue(existingUser);
      generateToken.mockReturnValue('mock-jwt-token');
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: 'mock-google-token' });
      
      expect(response.status).toBe(200);
      expect(response.body.access_token).toBe('mock-jwt-token');
      expect(response.body.user.id).toBe(1);
      expect(response.body.user.email).toBe('test@gmail.com');
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@gmail.com' } });
      expect(generateToken).toHaveBeenCalledWith({ id: 1 });
    });

    it('should create new user with Google login', async () => {
      const newUser = {
        id: 2,
        email: 'newuser@gmail.com',
        username: 'Test New User'
      };
      
      mockClient.verifyIdToken.mockResolvedValue(mockTicket);
      User.findOne.mockResolvedValue(null); // User doesn't exist
      User.create.mockResolvedValue(newUser);
      generateToken.mockReturnValue('new-user-token');
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: 'mock-google-token' });
      
      expect(response.status).toBe(201);
      expect(response.body.access_token).toBe('new-user-token');
      expect(response.body.user.id).toBe(2);
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        username: 'Test User',
        email: 'test@gmail.com'
      }));
    });

    it('should handle invalid Google token', async () => {
      mockClient.verifyIdToken.mockRejectedValue(new Error('Invalid token'));
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: 'invalid-token' });
      
      expect(response.status).toBe(500);
    });

    it('should handle validation errors during user creation', async () => {
      const validationError = {
        name: 'SequelizeValidationError',
        errors: [{ message: 'Email must be unique' }]
      };
      
      mockClient.verifyIdToken.mockResolvedValue(mockTicket);
      User.findOne.mockResolvedValue(null);
      User.create.mockRejectedValue(validationError);
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: 'mock-google-token' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation error');
      expect(response.body.details).toEqual(['Email must be unique']);
    });

    // Additional tests to cover lines 17-56
    it('should log token decoding and verification process', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Mock a token with proper structure for decoding
      const mockToken = 'header.' + Buffer.from(JSON.stringify({
        aud: 'test-google-client-id',
        email: 'test@gmail.com'
      })).toString('base64') + '.signature';
      
      const mockGooglePayload = {
        email: 'test@gmail.com',
        name: 'Test User',
        sub: 'google-user-id-123'
      };
      
      const mockTicket = {
        getPayload: () => mockGooglePayload
      };
      
      mockClient.verifyIdToken.mockResolvedValue(mockTicket);
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, email: 'test@gmail.com' });
      generateToken.mockReturnValue('mock-token');
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: mockToken });
      
      expect(response.status).toBe(201);
      expect(consoleSpy).toHaveBeenCalledWith('Token audience:', 'test-google-client-id');
      expect(consoleSpy).toHaveBeenCalledWith('Expected audience:', 'test-google-client-id');
      expect(consoleSpy).toHaveBeenCalledWith('Google payload received:', {
        email: 'test@gmail.com',
        name: 'Test User',
        sub: 'google-user-id-123'
      });
      
      consoleSpy.mockRestore();
    });

    it('should log existing user found process', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const existingUser = { id: 1, email: 'test@gmail.com' };
      
      mockClient.verifyIdToken.mockResolvedValue(mockTicket);
      User.findOne.mockResolvedValue(existingUser);
      generateToken.mockReturnValue('mock-token');
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: 'mock-google-token' });
      
      expect(response.status).toBe(200);
      expect(consoleSpy).toHaveBeenCalledWith('Existing user found:', 1);
      expect(consoleSpy).toHaveBeenCalledWith('Logging in existing user:', 1);
      
      consoleSpy.mockRestore();
    });

    it('should log new user creation process', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const newUser = { id: 2, email: 'newuser@gmail.com' };
      
      mockClient.verifyIdToken.mockResolvedValue(mockTicket);
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(newUser);
      generateToken.mockReturnValue('new-token');
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: 'mock-google-token' });
      
      expect(response.status).toBe(201);
      expect(consoleSpy).toHaveBeenCalledWith('Existing user found:', 'None');
      expect(consoleSpy).toHaveBeenCalledWith('Creating new user for email:', 'test@gmail.com');
      expect(consoleSpy).toHaveBeenCalledWith('User data to create:', {
        username: 'Test User',
        email: 'test@gmail.com',
        password: '[HIDDEN]'
      });
      expect(consoleSpy).toHaveBeenCalledWith('New user created successfully:', 2);
      
      consoleSpy.mockRestore();
    });

    it('should handle username fallback when name is not provided', async () => {
      const mockPayloadWithoutName = {
        email: 'test@gmail.com',
        sub: 'google-user-id-123'
        // name is undefined
      };
      
      const mockTicketWithoutName = {
        getPayload: () => mockPayloadWithoutName
      };
      
      mockClient.verifyIdToken.mockResolvedValue(mockTicketWithoutName);
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, email: 'test@gmail.com' });
      generateToken.mockReturnValue('mock-token');
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: 'mock-google-token' });
      
      expect(response.status).toBe(201);
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        username: 'test', // Should fallback to email prefix
        email: 'test@gmail.com'
      }));
    });

    // Test to cover lines 65-67 (detailed error logging)
    it('should log detailed error information on failure', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Token verification failed');
      mockError.name = 'TokenError';
      mockError.stack = 'Error stack trace';
      
      mockClient.verifyIdToken.mockRejectedValue(mockError);
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: 'invalid-token' });
      
      expect(response.status).toBe(500);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Google login error details:', {
        message: 'Token verification failed',
        stack: 'Error stack trace',
        name: 'TokenError'
      });
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle SequelizeValidationError specifically', async () => {
      const validationError = {
        name: 'SequelizeValidationError',
        errors: [{ message: 'Username is required' }, { message: 'Email must be valid' }]
      };
      
      mockClient.verifyIdToken.mockResolvedValue(mockTicket);
      User.findOne.mockResolvedValue(null);
      User.create.mockRejectedValue(validationError);
      
      const response = await request(app)
        .post('/auth/google')
        .send({ id_token: 'mock-google-token' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation error');
      expect(response.body.details).toEqual(['Username is required', 'Email must be valid']);
    });

    it('should call next(err) for non-validation errors', async () => {
      const nextSpy = jest.fn();
      const mockError = new Error('Database connection failed');
      
      mockClient.verifyIdToken.mockResolvedValue(mockTicket);
      User.findOne.mockResolvedValue(null);
      User.create.mockRejectedValue(mockError);
      
      // Mock the controller method directly to test next() call
      const req = { body: { id_token: 'mock-token' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await AuthController.googleLogin(req, res, nextSpy);
      
      expect(nextSpy).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Standard Login', () => {
    const mockUser = {
      id: 1,
      email: 'user@example.com',
      username: 'testuser',
      password: 'hashedpassword'
    };

    it('should login with valid credentials', async () => {
      User.findOne.mockResolvedValue(mockUser);
      comparePassword.mockReturnValue(true);
      generateToken.mockReturnValue('login-token');
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'correctpassword'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.token).toBe('login-token');
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'user@example.com' } });
      expect(comparePassword).toHaveBeenCalledWith('correctpassword', 'hashedpassword');
      expect(generateToken).toHaveBeenCalledWith({
        id: 1,
        email: 'user@example.com',
        username: 'testuser'
      });
    });

    it('should reject login with missing email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email must be filled');
      expect(User.findOne).not.toHaveBeenCalled();
    });

    it('should reject login with missing password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'user@example.com' });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password must be filled');
      expect(User.findOne).not.toHaveBeenCalled();
    });

    it('should reject login with non-existent email', async () => {
      User.findOne.mockResolvedValue(null);
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email not found');
      expect(comparePassword).not.toHaveBeenCalled();
    });

    it('should reject login with incorrect password', async () => {
      User.findOne.mockResolvedValue(mockUser);
      comparePassword.mockReturnValue(false);
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Check your email and password');
      expect(generateToken).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      User.findOne.mockRejectedValue(new Error('Database connection failed'));
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });

    // Additional test to ensure complete coverage of non-errorLogin exceptions
    it('should handle non-errorLogin exceptions with 500 status', async () => {
      const mockError = new Error('Unexpected database error');
      mockError.name = 'DatabaseError'; // Not 'errorLogin'
      
      User.findOne.mockRejectedValue(mockError);
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal Server Error');
    });
  });
});