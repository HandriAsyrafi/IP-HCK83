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

// Mock Sequelize constructor with proper implementation
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
  
  return SequelizeConstructor;
});

describe('Models Index', () => {
  let originalEnv;
  let mockSequelize;
  
  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    jest.clearAllMocks();
    jest.resetModules();
    
    // Setup mock sequelize instance
    mockSequelize = {
      define: jest.fn(),
      authenticate: jest.fn(),
      sync: jest.fn(),
      close: jest.fn()
    };
    
    const Sequelize = require('sequelize');
    Sequelize.mockImplementation(() => mockSequelize);
  });
  
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.resetModules();
  });
  
  describe('Database Configuration', () => {
    // Fix for lines 17-56: Test file filtering and model loading
    it('should properly filter files and load models (covering lines 17-28)', () => {
      process.env.NODE_ENV = 'test';
      
      // Mock fs.readdirSync to return various file types
      fs.readdirSync.mockReturnValue([
        'user.js',           // should be included
        'monster.js',        // should be included
        'weapon.js',         // should be included
        'recommendation.js', // should be included
        'index.js',          // should be excluded (basename)
        '.hidden.js',        // should be excluded (starts with .)
        'model.test.js',     // should be excluded (contains .test.js)
        'config.json',       // should be excluded (not .js)
        'temp.txt'           // should be excluded (not .js)
      ]);
      
      const db = require('../../models/index');
      
      expect(fs.readdirSync).toHaveBeenCalledWith(expect.stringContaining('models'));
      
      // Verify that only valid JS model files are loaded
      expect(Object.keys(db)).toContain('User');
      expect(Object.keys(db)).toContain('Monster');
      expect(Object.keys(db)).toContain('Weapon');
      expect(Object.keys(db)).toContain('Recommendation');
      
      // Verify sequelize and Sequelize are exported
      expect(db).toHaveProperty('sequelize');
      expect(db).toHaveProperty('Sequelize');
    });
    
    // Fix for lines 30-35: Test model associations
    it('should call associate methods for all models (covering lines 30-35)', () => {
      process.env.NODE_ENV = 'test';
      
      // Create spy functions for associate methods
      const userAssociateSpy = jest.fn();
      const monsterAssociateSpy = jest.fn();
      const weaponAssociateSpy = jest.fn();
      const recommendationAssociateSpy = jest.fn();
      
      // Mock models with associate methods
      jest.doMock('../../models/user', () => {
        return (sequelize, DataTypes) => {
          const User = sequelize.define('User', {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING
          });
          User.associate = userAssociateSpy;
          return User;
        };
      });
      
      jest.doMock('../../models/monster', () => {
        return (sequelize, DataTypes) => {
          const Monster = sequelize.define('Monster', {
            name: DataTypes.STRING,
            type: DataTypes.STRING
          });
          Monster.associate = monsterAssociateSpy;
          return Monster;
        };
      });
      
      jest.doMock('../../models/weapon', () => {
        return (sequelize, DataTypes) => {
          const Weapon = sequelize.define('Weapon', {
            name: DataTypes.STRING,
            type: DataTypes.STRING
          });
          Weapon.associate = weaponAssociateSpy;
          return Weapon;
        };
      });
      
      jest.doMock('../../models/recommendation', () => {
        return (sequelize, DataTypes) => {
          const Recommendation = sequelize.define('Recommendation', {
            reasoning: DataTypes.TEXT,
            effectivenessScore: DataTypes.INTEGER
          });
          Recommendation.associate = recommendationAssociateSpy;
          return Recommendation;
        };
      });
      
      fs.readdirSync.mockReturnValue([
        'user.js',
        'monster.js',
        'weapon.js',
        'recommendation.js'
      ]);
      
      const db = require('../../models/index');
      
      // Verify that associate methods were called with the db object
      expect(userAssociateSpy).toHaveBeenCalledWith(db);
      expect(monsterAssociateSpy).toHaveBeenCalledWith(db);
      expect(weaponAssociateSpy).toHaveBeenCalledWith(db);
      expect(recommendationAssociateSpy).toHaveBeenCalledWith(db);
    });
    
    // Fix for testing models without associate method
    it('should handle models without associate method gracefully', () => {
      process.env.NODE_ENV = 'test';
      
      // Mock a model without associate method
      jest.doMock('../../models/simple', () => {
        return (sequelize, DataTypes) => {
          const Simple = sequelize.define('Simple', {
            name: DataTypes.STRING
          });
          // No associate method defined
          return Simple;
        };
      });
      
      fs.readdirSync.mockReturnValue(['simple.js']);
      
      expect(() => {
        const db = require('../../models/index');
        expect(db).toHaveProperty('Simple');
      }).not.toThrow();
    });
    
    // Test for use_env_variable configuration (lines 11-15)
    it('should use environment variable when use_env_variable is specified', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL = 'postgres://user:pass@host:5432/db';
      
      fs.readdirSync.mockReturnValue([]);
      
      const Sequelize = require('sequelize');
      require('../../models/index');
      
      expect(Sequelize).toHaveBeenCalledWith(
        'postgres://user:pass@host:5432/db',
        expect.objectContaining({
          use_env_variable: 'DATABASE_URL'
        })
      );
    });
    
    // Test for regular configuration (lines 13-15)
    it('should use regular configuration when use_env_variable is not specified', () => {
      process.env.NODE_ENV = 'test';
      
      fs.readdirSync.mockReturnValue([]);
      
      const Sequelize = require('sequelize');
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
  });
  
  // Fix for lines 37-40: Test module exports
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
    
    it('should export db object with sequelize instance and Sequelize constructor (covering lines 37-40)', () => {
      const Sequelize = require('sequelize');
      const db = require('../../models/index');
      
      // Test line 37: db.sequelize = sequelize;
      expect(db).toHaveProperty('sequelize');
      expect(db.sequelize).toBe(mockSequelize);
      
      // Test line 38: db.Sequelize = Sequelize;
      expect(db).toHaveProperty('Sequelize');
      expect(db.Sequelize).toBe(Sequelize);
      
      // Test line 40: module.exports = db;
      expect(db).toHaveProperty('User');
      expect(db).toHaveProperty('Monster');
      expect(db).toHaveProperty('Weapon');
      expect(db).toHaveProperty('Recommendation');
    });
  });
  
  describe('Error Handling', () => {
    it('should handle file system errors gracefully', () => {
      process.env.NODE_ENV = 'test';
      
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
});