const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../../helpers/jwt');

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

// Mock environment variables
const originalEnv = process.env;

describe('JWT Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test_jwt_secret_key'
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('generateToken', () => {
    it('should generate token with payload', () => {
      const payload = { id: 1, username: 'testuser' };
      const mockToken = 'mock.jwt.token';

      jwt.sign.mockReturnValue(mockToken);

      const result = generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'test_jwt_secret_key');
      expect(result).toBe(mockToken);
    });

    it('should generate token for seeder user data', () => {
      const seederUsers = [
        { id: 1, username: 'Usersatu', email: 'satusatu@mail.com' },
        { id: 2, username: 'Userdua', email: 'duadua@mail.com' }
      ];

      seederUsers.forEach((user, index) => {
        const mockToken = `seeder.token.${index}`;
        jwt.sign.mockReturnValue(mockToken);

        const result = generateToken(user);

        expect(jwt.sign).toHaveBeenCalledWith(user, 'test_jwt_secret_key');
        expect(result).toBe(mockToken);
      });
    });

    it('should handle different payload structures', () => {
      const payloads = [
        { id: 1 },
        { id: 1, username: 'user' },
        { id: 1, username: 'user', email: 'user@example.com' },
        { id: 1, username: 'user', email: 'user@example.com', role: 'admin' },
        { userId: 123, data: { name: 'test' } }
      ];

      payloads.forEach((payload, index) => {
        const mockToken = `token.${index}`;
        jwt.sign.mockReturnValue(mockToken);

        const result = generateToken(payload);

        expect(jwt.sign).toHaveBeenCalledWith(payload, 'test_jwt_secret_key');
        expect(result).toBe(mockToken);
      });
    });

    it('should handle empty payload', () => {
      const payload = {};
      const mockToken = 'empty.payload.token';

      jwt.sign.mockReturnValue(mockToken);

      const result = generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'test_jwt_secret_key');
      expect(result).toBe(mockToken);
    });

    it('should use JWT_SECRET from environment', () => {
      const payload = { id: 1 };
      const customSecret = 'custom_secret_key';
      process.env.JWT_SECRET = customSecret;

      jwt.sign.mockReturnValue('token');

      generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, customSecret);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = 'valid.jwt.token';
      const mockPayload = { id: 1, username: 'testuser' };

      jwt.verify.mockReturnValue(mockPayload);

      const result = verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'test_jwt_secret_key');
      expect(result).toEqual(mockPayload);
    });

    it('should verify token for seeder users', () => {
      const seederTokens = [
        { token: 'usersatu.token', payload: { id: 1, username: 'Usersatu', email: 'satusatu@mail.com' } },
        { token: 'userdua.token', payload: { id: 2, username: 'Userdua', email: 'duadua@mail.com' } }
      ];

      seederTokens.forEach(({ token, payload }) => {
        jwt.verify.mockReturnValue(payload);

        const result = verifyToken(token);

        expect(jwt.verify).toHaveBeenCalledWith(token, 'test_jwt_secret_key');
        expect(result).toEqual(payload);
      });
    });

    it('should handle different token formats', () => {
      const tokens = [
        'short.token',
        'very.long.token.with.multiple.parts.and.segments',
        'token-with-dashes',
        'token_with_underscores'
      ];

      tokens.forEach((token, index) => {
        const mockPayload = { id: index, data: `payload_${index}` };
        jwt.verify.mockReturnValue(mockPayload);

        const result = verifyToken(token);

        expect(jwt.verify).toHaveBeenCalledWith(token, 'test_jwt_secret_key');
        expect(result).toEqual(mockPayload);
      });
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token';
      const mockError = new Error('Invalid token');

      jwt.verify.mockImplementation(() => {
        throw mockError;
      });

      expect(() => verifyToken(invalidToken)).toThrow('Invalid token');
      expect(jwt.verify).toHaveBeenCalledWith(invalidToken, 'test_jwt_secret_key');
    });

    it('should throw error for expired token', () => {
      const expiredToken = 'expired.token';
      const mockError = new Error('Token expired');
      mockError.name = 'TokenExpiredError';

      jwt.verify.mockImplementation(() => {
        throw mockError;
      });

      expect(() => verifyToken(expiredToken)).toThrow('Token expired');
      expect(jwt.verify).toHaveBeenCalledWith(expiredToken, 'test_jwt_secret_key');
    });

    it('should use JWT_SECRET from environment', () => {
      const token = 'test.token';
      const customSecret = 'another_secret_key';
      process.env.JWT_SECRET = customSecret;

      jwt.verify.mockReturnValue({ id: 1 });

      verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, customSecret);
    });
  });

  describe('Integration scenarios', () => {
    it('should work together for token generation and verification', () => {
      const payload = { id: 1, username: 'testuser', email: 'test@example.com' };
      const mockToken = 'integration.test.token';

      // Generate token
      jwt.sign.mockReturnValue(mockToken);
      const generatedToken = generateToken(payload);

      // Verify token
      jwt.verify.mockReturnValue(payload);
      const verifiedPayload = verifyToken(generatedToken);

      expect(generatedToken).toBe(mockToken);
      expect(verifiedPayload).toEqual(payload);
      expect(jwt.sign).toHaveBeenCalledWith(payload, 'test_jwt_secret_key');
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test_jwt_secret_key');
    });

    it('should simulate authentication flow', () => {
      // User login payload
      const userPayload = {
        id: 1,
        username: 'Usersatu',
        email: 'satusatu@mail.com'
      };

      // Generate token on login
      const loginToken = 'login.success.token';
      jwt.sign.mockReturnValue(loginToken);
      const token = generateToken(userPayload);

      // Verify token on protected route
      jwt.verify.mockReturnValue(userPayload);
      const authenticatedUser = verifyToken(token);

      expect(token).toBe(loginToken);
      expect(authenticatedUser).toEqual(userPayload);
    });

    it('should handle authentication failure', () => {
      const payload = { id: 1, username: 'user' };
      const token = 'valid.token';

      // Generate token successfully
      jwt.sign.mockReturnValue(token);
      const generatedToken = generateToken(payload);

      // Verification fails
      jwt.verify.mockImplementation(() => {
        throw new Error('Authentication failed');
      });

      expect(generatedToken).toBe(token);
      expect(() => verifyToken(generatedToken)).toThrow('Authentication failed');
    });
  });

  describe('Environment variable handling', () => {
    it('should handle missing JWT_SECRET', () => {
      delete process.env.JWT_SECRET;
      const payload = { id: 1 };

      jwt.sign.mockReturnValue('token');

      generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, undefined);
    });

    it('should handle empty JWT_SECRET', () => {
      process.env.JWT_SECRET = '';
      const payload = { id: 1 };

      jwt.sign.mockReturnValue('token');

      generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, '');
    });
  });
});