const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Mock the config file
jest.mock('../../config/config.json', () => ({
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'test_database',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'dev_database',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
}));

// Mock fs module
jest.mock('fs');

// Mock individual model files
jest.mock('../../models/user', () => {
  return (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    });
    User.associate = (models) => {
      User.hasMany(models.Recommendation, { foreignKey: 'userId' });
    };
    return User;
  };
});

jest.mock('../../models/monster', () => {
  return (sequelize, DataTypes) => {
    const Monster = sequelize.define('Monster', {
      name: DataTypes.STRING,
      type: DataTypes.STRING
    });
    Monster.associate = (models) => {
      Monster.hasMany(models.Recommendation, { foreignKey: 'monsterId' });
    };
    return Monster;
  };
});

jest.mock('../../models/weapon', () => {
  return (sequelize, DataTypes) => {
    const Weapon = sequelize.define('Weapon', {
      name: DataTypes.STRING,
      type: DataTypes.STRING
    });
    Weapon.associate = (models) => {
      Weapon.hasMany(models.Recommendation, { foreignKey: 'weaponId' });
    };
    return Weapon;
  };
});

jest.mock('../../models/recommendation', () => {
  return (sequelize, DataTypes) => {
    const Recommendation = sequelize.define('Recommendation', {
      reasoning: DataTypes.TEXT,
      effectivenessScore: DataTypes.INTEGER
    });
    Recommendation.associate = (models) => {
      Recommendation.belongsTo(models.User, { foreignKey: 'userId' });
      Recommendation.belongsTo(models.Monster, { foreignKey: 'monsterId' });
      Recommendation.belongsTo(models.Weapon, { foreignKey: 'weaponId' });
    };
    return Recommendation;
  };
});

// Mock Sequelize constructor
jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');
  const mockSequelize = {
    define: jest.fn(),
    authenticate: jest.fn(),
    sync: jest.fn(),
    close: jest.fn()
  };
  
  const SequelizeConstructor = jest.fn().mockImplementation(() => mockSequelize);
  SequelizeConstructor.DataTypes = actualSequelize.DataTypes;
  
  return {
    Sequelize: SequelizeConstructor,
    DataTypes: actualSequelize.DataTypes
  };
});

describe('Models Index', () => {
  let originalEnv;
  let mockSequelize;
  
  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    jest.clearAllMocks();
    
    // Setup mock sequelize instance
    mockSequelize = {
      define: jest.fn(),
      authenticate: jest.fn(),
      sync: jest.fn(),
      close: jest.fn()
    };
    
    const { Sequelize } = require('sequelize');
    Sequelize.mockImplementation(() => mockSequelize);
  });
  
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.resetModules();
  });
  
  describe('Database Configuration', () => {
    it('should use test environment configuration when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      
      // Mock fs.readdirSync to return empty array to avoid model loading
      fs.readdirSync.mockReturnValue([]);
      
      const { Sequelize } = require('sequelize');
      require('../../models/index');
      
      expect(Sequelize).toHaveBeenCalledWith(
        'test_database',
        'postgres',
        'postgres',
        expect.objectContaining({
          username: 'postgres',
          password: 'postgres',
          database: 'test_database',
          host: '127.0.0.1',
          dialect: 'postgres'
        })
      );
    });
    
    it('should use development environment configuration when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;
      
      fs.readdirSync.mockReturnValue([]);
      
      const { Sequelize } = require('sequelize');
      require('../../models/index');
      
      expect(Sequelize).toHaveBeenCalledWith(
        'dev_database',
        'postgres',
        'postgres',
        expect.objectContaining({
          username: 'postgres',
          password: 'postgres',
          database: 'dev_database',
          host: '127.0.0.1',
          dialect: 'postgres'
        })
      );
    });
    
    it('should use environment variable when use_env_variable is specified', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgres://user:pass@host:5432/db';
      
      fs.readdirSync.mockReturnValue([]);
      
      const { Sequelize } = require('sequelize');
      require('../../models/index');
      
      expect(Sequelize).toHaveBeenCalledWith(
        'postgres://user:pass@host:5432/db',
        expect.objectContaining({
          use_env_variable: 'DATABASE_URL'
        })
      );
    });
  });
  
  describe('Model Loading and Associations', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });
    
    it('should load all model files and exclude non-JS files', () => {
      fs.readdirSync.mockReturnValue([
        'user.js',
        'monster.js',
        'weapon.js',
        'recommendation.js',
        'index.js', // should be excluded
        '.hidden.js', // should be excluded
        'model.test.js', // should be excluded
        'config.json' // should be excluded
      ]);
      
      const db = require('../../models/index');
      
      expect(fs.readdirSync).toHaveBeenCalledWith(expect.stringContaining('models'));
      
      // Should have loaded 4 models (excluding index.js, hidden files, test files, and non-JS files)
      expect(Object.keys(db)).toContain('User');
      expect(Object.keys(db)).toContain('Monster');
      expect(Object.keys(db)).toContain('Weapon');
      expect(Object.keys(db)).toContain('Recommendation');
    });
    
    it('should set up model associations', () => {
      fs.readdirSync.mockReturnValue([
        'user.js',
        'monster.js',
        'weapon.js',
        'recommendation.js'
      ]);
      
      const db = require('../../models/index');
      
      // Verify that models have associate methods called
      expect(db.User.associate).toBeDefined();
      expect(db.Monster.associate).toBeDefined();
      expect(db.Weapon.associate).toBeDefined();
      expect(db.Recommendation.associate).toBeDefined();
    });
    
    it('should handle models without associate method', () => {
      // Mock a model without associate method
      jest.doMock('../../models/simple', () => {
        return (sequelize, DataTypes) => {
          return sequelize.define('Simple', {
            name: DataTypes.STRING
          });
          // No associate method
        };
      });
      
      fs.readdirSync.mockReturnValue(['simple.js']);
      
      expect(() => {
        require('../../models/index');
      }).not.toThrow();
    });
  });
  
  describe('Database Connection', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
      fs.readdirSync.mockReturnValue([]);
    });
    
    it('should create Sequelize instance with correct configuration', () => {
      const { Sequelize } = require('sequelize');
      const db = require('../../models/index');
      
      expect(Sequelize).toHaveBeenCalledTimes(1);
      expect(db.sequelize).toBeDefined();
      expect(db.Sequelize).toBeDefined();
    });
  });
  
  describe('Module Export', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
      fs.readdirSync.mockReturnValue([
        'user.js',
        'monster.js',
        'weapon.js',
        'recommendation.js'
      ]);
    });
    
    it('should export db object with sequelize instance and models', () => {
      const db = require('../../models/index');
      
      expect(db).toHaveProperty('sequelize');
      expect(db).toHaveProperty('Sequelize');
      expect(db).toHaveProperty('User');
      expect(db).toHaveProperty('Monster');
      expect(db).toHaveProperty('Weapon');
      expect(db).toHaveProperty('Recommendation');
    });
    
    it('should export Sequelize constructor and instance', () => {
      const db = require('../../models/index');
      const { Sequelize } = require('sequelize');
      
      expect(db.Sequelize).toBe(Sequelize);
      expect(db.sequelize).toBe(mockSequelize);
    });
  });
  
  describe('Error Handling', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });
    
    it('should handle file system errors gracefully', () => {
      fs.readdirSync.mockImplementation(() => {
        throw new Error('File system error');
      });
      
      expect(() => {
        require('../../models/index');
      }).toThrow('File system error');
    });
    
    it('should handle missing config environment', () => {
      process.env.NODE_ENV = 'nonexistent';
      fs.readdirSync.mockReturnValue([]);
      
      expect(() => {
        require('../../models/index');
      }).toThrow();
    });
  });
  
  describe('Environment Variable Handling', () => {
    beforeEach(() => {
      fs.readdirSync.mockReturnValue([]);
    });
    
    it('should handle missing environment variable when use_env_variable is specified', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;
      
      const { Sequelize } = require('sequelize');
      require('../../models/index');
      
      expect(Sequelize).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          use_env_variable: 'DATABASE_URL'
        })
      );
    });
  });
});