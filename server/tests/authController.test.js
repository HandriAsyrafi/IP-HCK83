const request = require('supertest');
const express = require('express');
const AuthController = require('../controllers/authController');
const { User } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
require('./setup');

const app = express();
app.use(express.json());
app.post('/login', AuthController.login);

describe('AuthController', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashPassword('password123')
    });
  });

  describe('POST /login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email must be filled');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password must be filled');
    });

    it('should return 401 when email not found', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Email not found');
    });

    it('should return 401 when password is incorrect', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Check your email and password');
    });
  });
});