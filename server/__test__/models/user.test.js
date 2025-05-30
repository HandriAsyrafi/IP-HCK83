const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../../models/user');
const { generatePassword } = require('../../helpers/bcrypt');

// Mock the bcrypt helper
jest.mock('../../helpers/bcrypt', () => ({
  generatePassword: jest.fn((password) => `hashed_${password}`)
}));

describe('User Model', () => {
  let sequelize;
  let User;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false
    });
    
    User = UserModel(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
    generatePassword.mockClear();
  });

  describe('Model Definition', () => {
    it('should have correct table name', () => {
      expect(User.tableName).toBe('Users');
    });

    it('should have correct attributes', () => {
      const attributes = Object.keys(User.rawAttributes);
      
      expect(attributes).toContain('username');
      expect(attributes).toContain('email');
      expect(attributes).toContain('password');
      expect(attributes).toContain('id');
      expect(attributes).toContain('createdAt');
      expect(attributes).toContain('updatedAt');
    });

    it('should have correct data types', () => {
      const attributes = User.rawAttributes;
      
      expect(attributes.username.type.constructor.name).toBe('STRING');
      expect(attributes.email.type.constructor.name).toBe('STRING');
      expect(attributes.password.type.constructor.name).toBe('STRING');
    });
  });

  describe('Validations', () => {
    describe('username validation', () => {
      it('should not allow null username', async () => {
        await expect(User.create({
          username: null,
          email: 'test@example.com',
          password: '123456'
        })).rejects.toThrow();
      });

      it('should not allow empty username', async () => {
        await expect(User.create({
          username: '',
          email: 'test@example.com',
          password: '123456'
        })).rejects.toThrow();
      });

      it('should create user with valid username like seeder data', async () => {
        const user = await User.create({
          username: 'Usersatu',
          email: 'satusatu@mail.com',
          password: '123456'
        });
        
        expect(user.username).toBe('Usersatu');
      });
    });

    describe('email validation', () => {
      it('should not allow null email', async () => {
        await expect(User.create({
          username: 'testuser',
          email: null,
          password: '123456'
        })).rejects.toThrow();
      });

      it('should not allow invalid email format', async () => {
        await expect(User.create({
          username: 'testuser',
          email: 'invalid-email',
          password: '123456'
        })).rejects.toThrow();
      });

      it('should not allow duplicate email', async () => {
        await User.create({
          username: 'user1',
          email: 'test@example.com',
          password: '123456'
        });

        await expect(User.create({
          username: 'user2',
          email: 'test@example.com',
          password: '654321'
        })).rejects.toThrow();
      });

      it('should create user with valid email like seeder data', async () => {
        const user = await User.create({
          username: 'Userdua',
          email: 'duadua@mail.com',
          password: '234567'
        });
        
        expect(user.email).toBe('duadua@mail.com');
      });
    });

    describe('password validation', () => {
      it('should not allow null password', async () => {
        await expect(User.create({
          username: 'testuser',
          email: 'test@example.com',
          password: null
        })).rejects.toThrow();
      });

      it('should not allow empty password', async () => {
        await expect(User.create({
          username: 'testuser',
          email: 'test@example.com',
          password: ''
        })).rejects.toThrow();
      });
    });
  });

  describe('Hooks', () => {
    it('should hash password before create', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: '123456'
      });

      expect(generatePassword).toHaveBeenCalledWith('123456');
      expect(user.password).toBe('hashed_123456');
    });

    it('should hash password with seeder data patterns', async () => {
      const userData = [
        { username: 'Usersatu', email: 'satusatu@mail.com', password: '123456' },
        { username: 'Userdua', email: 'duadua@mail.com', password: '234567' }
      ];

      for (const data of userData) {
        await User.create(data);
        expect(generatePassword).toHaveBeenCalledWith(data.password);
      }
    });
  });

  describe('CRUD Operations', () => {
    it('should create user successfully', async () => {
      const user = await User.create({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      });

      expect(user.id).toBeDefined();
      expect(user.username).toBe('newuser');
      expect(user.email).toBe('new@example.com');
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should find user by id', async () => {
      const createdUser = await User.create({
        username: 'finduser',
        email: 'find@example.com',
        password: 'password123'
      });

      const foundUser = await User.findByPk(createdUser.id);
      expect(foundUser.username).toBe('finduser');
      expect(foundUser.email).toBe('find@example.com');
    });

    it('should update user', async () => {
      const user = await User.create({
        username: 'updateuser',
        email: 'update@example.com',
        password: 'password123'
      });

      await user.update({ username: 'updateduser' });
      expect(user.username).toBe('updateduser');
    });

    it('should delete user', async () => {
      const user = await User.create({
        username: 'deleteuser',
        email: 'delete@example.com',
        password: 'password123'
      });

      await user.destroy();
      const deletedUser = await User.findByPk(user.id);
      expect(deletedUser).toBeNull();
    });
  });

  describe('Associations', () => {
    it('should have associate method', () => {
      expect(typeof User.associate).toBe('function');
    });

    it('should call associate without errors', () => {
      const mockModels = {
        Recommendation: { hasMany: jest.fn() }
      };
      expect(() => User.associate(mockModels)).not.toThrow();
    });
  });
});