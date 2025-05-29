const { Sequelize } = require('sequelize');
const path = require('path');

// Setup test database
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.GOOGLE_API_KEY = 'test-google-api-key';

// Mock Sequelize for testing
jest.mock('../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  
  return {
    User: dbMock.define('User', {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      password: '$2b$10$hashedpassword'
    }),
    Monster: dbMock.define('Monster', {
      id: 1,
      name: 'Test Monster',
      species: 'Test Species',
      description: 'Test Description',
      weaknesses: ['fire', 'water']
    }),
    Weapon: dbMock.define('Weapon', {
      id: 1,
      name: 'Test Weapon',
      kind: 'sword',
      rarity: 5,
      damage: 100,
      element: 'fire',
      damageElement: 'fire'
    }),
    Recommendation: dbMock.define('Recommendation', {
      id: 1,
      userId: 1,
      weaponId: 1,
      reasoning: 'Test reasoning'
    })
  };
});

// Mock Gemini API
jest.mock('../lib/gemini.api', () => ({
  generateWeaponRecommendation: jest.fn().mockResolvedValue({
    weaponId: 1,
    reasoning: 'Test AI recommendation'
  }),
  generateMonsterAnalysis: jest.fn().mockResolvedValue({
    analysis: 'Test monster analysis',
    strategies: ['strategy1', 'strategy2']
  })
}));

// Global test timeout
jest.setTimeout(10000);


const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await sequelize.truncate({