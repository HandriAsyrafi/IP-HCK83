const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middleware/auth');
const { User } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
require('./setup');

const app = express();
app.use(express.json());
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

describe('Authentication Middleware', () => {
  let testUser, validToken;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashPassword('password123')
    });

    validToken = jwt.sign(
      { id: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'test-secret'
    );
  });

  it('should allow access with valid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should deny access without token', async () => {
    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Access token required');
  });

  it('should deny access with invalid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid token');
  });

  it('should deny access with token for non-existent user', async () => {
    const invalidUserToken = jwt.sign(
      { id: 999, email: 'nonexistent@example.com' },
      process.env.JWT_SECRET || 'test-secret'
    );

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${invalidUserToken}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid token');
  });
});