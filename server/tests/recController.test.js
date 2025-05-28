const request = require('supertest');
const express = require('express');
const RecController = require('../controllers/recController');
const { User, Monster, Weapon, Recommendation } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
const GeminiService = require('../lib/gemini.api');
require('./setup');

// Mock Gemini Service
jest.mock('../lib/gemini.api');

const app = express();
app.use(express.json());
app.get('/recommendations', RecController.rec);
app.post('/recommendations/generate', RecController.generateRecommendation);
app.delete('/recommendations/:id', RecController.delRec);
app.get('/monsters/:monsterId/analyze', RecController.analyzeMonster);
app.get('/monsters/:monsterId/best-weapon', RecController.getBestWeaponForMonster);

describe('RecController', () => {
  let testUser, testMonster, testWeapon;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashPassword('password123')
    });

    testMonster = await Monster.create({
      name: 'Rathalos',
      species: 'Flying Wyvern',
      description: 'King of the skies',
      weaknesses: ['dragon', 'thunder']
    });

    testWeapon = await Weapon.create({
      name: 'Dragon Slayer',
      kind: 'Great Sword',
      rarity: 5,
      damage: 200,
      element: 'dragon',
      damageElement: 30
    });
  });

  describe('GET /recommendations', () => {
    it('should return all recommendations', async () => {
      await Recommendation.create({
        userId: testUser.id,
        weaponId: testWeapon.id,
        reasoning: 'Test recommendation'
      });

      const response = await request(app).get('/recommendations');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('reasoning', 'Test recommendation');
    });

    it('should return empty array when no recommendations exist', async () => {
      const response = await request(app).get('/recommendations');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('POST /recommendations/generate', () => {
    beforeEach(() => {
      GeminiService.generateWeaponRecommendation.mockResolvedValue({
        weaponId: testWeapon.id,
        reasoning: 'AI generated recommendation'
      });
    });

    it('should generate recommendation successfully', async () => {
      const response = await request(app)
        .post('/recommendations/generate')
        .send({
          userId: testUser.id,
          monsterId: testMonster.id,
          preferences: { playstyle: 'aggressive' }
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('recommendation');
      expect(response.body).toHaveProperty('aiAnalysis');
    });

    it('should return 404 when user not found', async () => {
      const response = await request(app)
        .post('/recommendations/generate')
        .send({
          userId: 999,
          monsterId: testMonster.id,
          preferences: { playstyle: 'aggressive' }
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User or Monster not found');
    });

    it('should return 404 when monster not found', async () => {
      const response = await request(app)
        .post('/recommendations/generate')
        .send({
          userId: testUser.id,
          monsterId: 999,
          preferences: { playstyle: 'aggressive' }
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User or Monster not found');
    });
  });

  describe('GET /monsters/:monsterId/analyze', () => {
    beforeEach(() => {
      GeminiService.generateMonsterAnalysis.mockResolvedValue({
        strengths: ['High damage', 'Flying ability'],
        weaknesses: ['Vulnerable to dragon element'],
        strategy: 'Use dragon weapons and target wings'
      });
    });

    it('should analyze monster successfully', async () => {
      const response = await request(app)
        .get(`/monsters/${testMonster.id}/analyze`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('monster');
      expect(response.body).toHaveProperty('analysis');
      expect(response.body.monster.name).toBe('Rathalos');
    });

    it('should return 404 when monster not found', async () => {
      const response = await request(app)
        .get('/monsters/999/analyze');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Monster not found');
    });
  });

  describe('GET /monsters/:monsterId/best-weapon', () => {
    beforeEach(() => {
      GeminiService.generateWeaponRecommendation.mockResolvedValue({
        weaponId: testWeapon.id,
        reasoning: 'Dragon element is effective against Rathalos'
      });
    });

    it('should return best weapon recommendation', async () => {
      const response = await request(app)
        .get(`/monsters/${testMonster.id}/best-weapon`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('monster');
      expect(response.body).toHaveProperty('recommendedWeapon');
      expect(response.body).toHaveProperty('recommendation');
      expect(response.body).toHaveProperty('alternativeWeapons');
    });

    it('should return 404 when monster not found', async () => {
      const response = await request(app)
        .get('/monsters/999/best-weapon');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Monster not found');
    });

    it('should return 404 when no weapons available', async () => {
      await Weapon.destroy({ where: {} });
      
      const response = await request(app)
        .get(`/monsters/${testMonster.id}/best-weapon`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No weapons available');
    });
  });

  describe('DELETE /recommendations/:id', () => {
    it('should delete recommendation successfully', async () => {
      const recommendation = await Recommendation.create({
        userId: testUser.id,
        weaponId: testWeapon.id,
        reasoning: 'Test recommendation'
      });

      const response = await request(app)
        .delete(`/recommendations/${recommendation.id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Recommendation deleted successfully');
    });

    it('should return 404 when recommendation not found', async () => {
      const response = await request(app)
        .delete('/recommendations/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Recommendation not found');
    });
  });
});