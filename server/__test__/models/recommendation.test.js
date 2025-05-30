const { Sequelize, DataTypes } = require('sequelize');
const RecommendationModel = require('../../models/recommendation');
const UserModel = require('../../models/user');
const WeaponModel = require('../../models/weapon');

// Mock bcrypt helper
jest.mock('../../helpers/bcrypt', () => ({
  generatePassword: jest.fn((password) => `hashed_${password}`)
}));

describe('Recommendation Model', () => {
  let sequelize;
  let Recommendation;
  let User;
  let Weapon;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false
    });

    User = UserModel(sequelize, DataTypes);
    Weapon = WeaponModel(sequelize, DataTypes);
    Recommendation = RecommendationModel(sequelize, DataTypes);

    // Set up associations
    Recommendation.associate({ User, Weapon });
    User.associate({ Recommendation });
    Weapon.associate({ Recommendation });

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Recommendation.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Weapon.destroy({ where: {} });
  });

  describe('Model Definition', () => {
    it('should have correct table name', () => {
      expect(Recommendation.tableName).toBe('Recommendations');
    });

    it('should have correct attributes', () => {
      const attributes = Object.keys(Recommendation.rawAttributes);

      expect(attributes).toContain('userId');
      expect(attributes).toContain('weaponId');
      expect(attributes).toContain('reasoning');
      expect(attributes).toContain('id');
      expect(attributes).toContain('createdAt');
      expect(attributes).toContain('updatedAt');
    });

    it('should have correct data types', () => {
      const attributes = Recommendation.rawAttributes;

      expect(attributes.userId.type.constructor.name).toBe('INTEGER');
      expect(attributes.weaponId.type.constructor.name).toBe('INTEGER');
      expect(attributes.reasoning.type.constructor.name).toBe('TEXT');
    });
  });

  describe('CRUD Operations', () => {
    let testUser;
    let testWeapon;

    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: '123456'
      });

      testWeapon = await Weapon.create({
        name: 'Test Weapon',
        kind: 'Hammer',
        rarity: 6,
        damage: 1200
      });
    });

    it('should create recommendation with reasoning', async () => {
      const recommendation = await Recommendation.create({
        userId: testUser.id,
        weaponId: testWeapon.id.toString(),
        reasoning: 'This weapon is effective against fire-type monsters due to its water element.'
      });

      expect(recommendation.userId).toBe(testUser.id);
      expect(recommendation.weaponId).toBe(testWeapon.id.toString());
      expect(recommendation.reasoning).toBe('This weapon is effective against fire-type monsters due to its water element.');
      expect(recommendation.id).toBeDefined();
    });

    it('should find recommendation by id', async () => {
      const createdRecommendation = await Recommendation.create({
        userId: testUser.id,
        weaponId: testWeapon.id.toString(),
        reasoning: 'Great for beginners'
      });

      const foundRecommendation = await Recommendation.findByPk(createdRecommendation.id);
      expect(foundRecommendation.reasoning).toBe('Great for beginners');
    });

    it('should update recommendation', async () => {
      const recommendation = await Recommendation.create({
        userId: testUser.id,
        weaponId: testWeapon.id.toString(),
        reasoning: 'Original reasoning'
      });

      await recommendation.update({
        reasoning: 'Updated reasoning with more details'
      });

      expect(recommendation.reasoning).toBe('Updated reasoning with more details');
    });

    it('should delete recommendation', async () => {
      const recommendation = await Recommendation.create({
        userId: testUser.id,
        weaponId: testWeapon.id.toString(),
        reasoning: 'To be deleted'
      });

      await recommendation.destroy();
      const deletedRecommendation = await Recommendation.findByPk(recommendation.id);
      expect(deletedRecommendation).toBeNull();
    });
  });

  describe('Associations', () => {
    let testUser;
    let testWeapon;

    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: '123456'
      });

      testWeapon = await Weapon.create({
        name: 'Test Weapon',
        kind: 'Hammer',
        rarity: 6,
        damage: 1200
      });
    });

    it('should have associate method', () => {
      expect(typeof Recommendation.associate).toBe('function');
    });

    it('should belong to User', async () => {
      const recommendation = await Recommendation.create({
        userId: testUser.id,
        weaponId: testWeapon.id.toString(),
        reasoning: 'Test reasoning'
      });

      const recommendationWithUser = await Recommendation.findByPk(recommendation.id, {
        include: [User]
      });

      expect(recommendationWithUser.User).toBeDefined();
      expect(recommendationWithUser.User.username).toBe('testuser');
    });

    it('should belong to Weapon', async () => {
      const recommendation = await Recommendation.create({
        userId: testUser.id,
        weaponId: testWeapon.id.toString(),
        reasoning: 'Test reasoning'
      });

      const recommendationWithWeapon = await Recommendation.findByPk(recommendation.id, {
        include: [Weapon]
      });

      expect(recommendationWithWeapon.Weapon).toBeDefined();
      expect(recommendationWithWeapon.Weapon.name).toBe('Test Weapon');
    });
  });

  describe('Query Operations', () => {
    let testUser1, testUser2;
    let testWeapon1, testWeapon2;

    beforeEach(async () => {
      testUser1 = await User.create({
        username: 'user1',
        email: 'user1@example.com',
        password: '123456'
      });

      testUser2 = await User.create({
        username: 'user2',
        email: 'user2@example.com',
        password: '123456'
      });

      testWeapon1 = await Weapon.create({
        name: 'Weapon 1',
        kind: 'Hammer',
        rarity: 6,
        damage: 1200
      });

      testWeapon2 = await Weapon.create({
        name: 'Weapon 2',
        kind: 'Sword',
        rarity: 7,
        damage: 1300
      });
    });

    it('should find recommendations by user', async () => {
      await Recommendation.bulkCreate([
        { userId: testUser1.id, weaponId: testWeapon1.id.toString(), reasoning: 'Good for user1' },
        { userId: testUser1.id, weaponId: testWeapon2.id.toString(), reasoning: 'Also good for user1' },
        { userId: testUser2.id, weaponId: testWeapon1.id.toString(), reasoning: 'Good for user2' }
      ]);

      const user1Recommendations = await Recommendation.findAll({
        where: { userId: testUser1.id }
      });

      expect(user1Recommendations).toHaveLength(2);
      user1Recommendations.forEach(rec => {
        expect(rec.userId).toBe(testUser1.id);
      });
    });

    it('should find recommendations by weapon', async () => {
      await Recommendation.bulkCreate([
        { userId: testUser1.id, weaponId: testWeapon1.id.toString(), reasoning: 'User1 likes weapon1' },
        { userId: testUser2.id, weaponId: testWeapon1.id.toString(), reasoning: 'User2 also likes weapon1' },
        { userId: testUser1.id, weaponId: testWeapon2.id.toString(), reasoning: 'User1 likes weapon2' }
      ]);

      const weapon1Recommendations = await Recommendation.findAll({
        where: { weaponId: testWeapon1.id.toString() }
      });

      expect(weapon1Recommendations).toHaveLength(2);
      weapon1Recommendations.forEach(rec => {
        expect(rec.weaponId).toBe(testWeapon1.id.toString());
      });
    });
  });
});
