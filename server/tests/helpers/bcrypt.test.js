const bcrypt = require('bcryptjs');
const { hashPassword, comparePassword } = require('../../helpers/bcrypt');

jest.mock('bcryptjs');

describe('Bcrypt Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password successfully', () => {
      const password = 'testpassword';
      const hashedPassword = 'hashedpassword';
      
      bcrypt.hashSync.mockReturnValue(hashedPassword);
      
      const result = hashPassword(password);
      
      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', () => {
      const password = 'testpassword';
      const hashedPassword = 'hashedpassword';
      
      bcrypt.compareSync.mockReturnValue(true);
      
      const result = comparePassword(password, hashedPassword);
      
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', () => {
      const password = 'testpassword';
      const hashedPassword = 'hashedpassword';
      
      bcrypt.compareSync.mockReturnValue(false);
      
      const result = comparePassword(password, hashedPassword);
      
      expect(result).toBe(false);
    });
  });
});