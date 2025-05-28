const request = require('supertest');
const app = require('../app');
const { User, Monster, Weapon } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
require('./setup');

describe('Integration Tests', () => {
  it('should handle complete workflow', async () => {
    // Create test data
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashPassword('password123')
    });

    const monster = await Monster.create({
      name: 'Rathalos',
      species: 'Flying Wyvern',
      description: 'King of the skies',
      weaknesses: ['dragon', 'thunder']
    });

    await Weapon.create({
      name: 'Dragon Slayer',
      kind: 'Great Sword',
      rarity: 5,
      damage: 200,
      element: 'dragon',
      damageElement: 30
    });

    // Test login
    const loginResponse = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.access_token;

    // Test get monsters
    const monstersResponse = await request(app).get('/monsters');
    expect(monstersResponse.status).toBe(200);
    expect(monstersResponse.body).toHaveLength(1);

    // Test get weapons
    const weaponsResponse = await request(app).get('/weapons');
    expect(weaponsResponse.status).toBe(200);
    expect(weaponsResponse.body).toHaveLength(1);

    // Test monster analysis
    const analysisResponse = await request(app)
      .get(`/monsters/${monster.id}/analyze`);
    expect(analysisResponse.status).toBe(200);

    // Test best weapon recommendation
    const bestWeaponResponse = await request(app)
      .get(`/monsters/${monster.id}/best-weapon`);
    expect(bestWeaponResponse.status).toBe(200);
  });
});