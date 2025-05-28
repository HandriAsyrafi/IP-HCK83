const { authenticate } = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should authenticate user with valid token', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockDecoded = { id: 1 };

    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue(mockDecoded);
    User.findByPk = jest.fn().mockResolvedValue(mockUser);

    await authenticate(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 when no token provided', async () => {
    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when user not found', async () => {
    const mockDecoded = { id: 999 };

    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue(mockDecoded);
    User.findByPk = jest.fn().mockResolvedValue(null);

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});