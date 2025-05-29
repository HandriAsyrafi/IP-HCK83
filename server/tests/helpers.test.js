const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { generateToken, verifyToken } = require('../helpers/jwt');

describe('Helper Functions', () => {
  describe('bcrypt helpers', () => {
    it('should hash password correctly', () => {
      const password = 'testpassword';
      const hashed = hashPassword(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(typeof hashed).toBe('string');
    });

    it('should compare password correctly', () => {
      const password = 'testpassword';
      const hashed = hashPassword(password);
      
      expect(comparePassword(password, hashed)).toBe(true);
      expect(comparePassword('wrongpassword', hashed)).toBe(false);
    });
  });

  describe('jwt helpers', () => {
    const payload = { id: 1, email: 'test@example.com' };

    it('should generate token correctly', () => {
      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should verify token correctly', () => {
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow();
    });
  });
});