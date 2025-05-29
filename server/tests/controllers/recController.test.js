const request = require('supertest');
const express = require('express');
const RecController = require('../../controllers/recController');
const { Recommendation, Weapon, User, Monster } = require('../../models');
const GeminiService = require('../../lib/gemini.api');

const app = express();
app.use(express.json());
app.get('/recommendations', RecController.rec);
app.post('/recommendations/generate', RecController.generateRecommendation);
app.delete('/recommendations/:id', RecController.delRec);
app.get('/monsters/:monsterId/analyze', RecController.analyzeMonster);
app.get('/monsters/:monsterId/best-weapon', RecController.getBestWeaponForMonster);

describe('RecController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /recommendations', () => {
    it('should return all recommendations with includes', async () => {
      const mockRecommendations = [
        {
          id: 1,
          userId: 1,
          weaponId: 1,
          reasoning: 'Test reasoning',
          Weapon: { name: 'Test Weapon' },
          User: { username: 'testuser' }
        }
      ];

      Recommendation.findAll = jest.fn().mockResolvedValue(mockRecommendations);

      const response = await request(app).get('/recommendations');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecommendations);
      expect(Recommendation.findAll).toHaveBeenCalledWith({
        include: [Weapon, User]
      });
    });

    it('should handle database errors', async () => {
      Recommendation.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/recommendations');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch recommendations');
    });
  });

  describe('POST /recommendations/generate', () => {
    it('should generate recommendation successfully', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      const mockMonster = { id: 1, name: 'Test Monster' };
      const mockWeapons = [{ id: 1, name: 'Test Weapon' }];
      const mockRecommendation = {
        id: 1,
        userId: 1,
        weaponId: 1,
        reasoning: 'AI reasoning'
      };

      User.findByPk = jest.fn().mockResolvedValue(mockUser);
      Monster.findByPk = jest.fn().mockResolvedValue(mockMonster);
      Weapon.findAll = jest.fn().mockResolvedValue(mockWeapons);
      Weapon.findByPk = jest.fn().mockResolvedValue(mockWeapons[0]);
      Recommendation.create = jest.fn().mockResolvedValue(mockRecommendation);
      Recommendation.findByPk = jest.fn().mockResolvedValue({
        ...mockRecommendation,
        Weapon: mockWeapons[0],
        User: mockUser
      });

      const response = await request(app)
        .post('/recommendations/generate')
        .send({
          userId: 1,
          monsterId: 1,
          preferences: { playstyle: 'aggressive' }
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('recommendation');
      expect(response.body).toHaveProperty('aiAnalysis');
    });

    it('should return 404 when user not found', async () => {
      User.findByPk = jest.fn().mockResolvedValue(null);
      Monster.findByPk = jest.fn().mockResolvedValue({ id: 1 });

      const response = await request(app)
        .post('/recommendations/generate')
        .send({
          userId: 999,
          monsterId: 1,
          preferences: {}
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User or Monster not found');
    });

    it('should return 404 when monster not found', async () => {
      User.findByPk = jest.fn().mockResolvedValue({ id: 1 });
      Monster.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/recommendations/generate')
        .send({
          userId: 1,
          monsterId: 999,
          preferences: {}
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User or Monster not found');
    });

    it('should return 404 when recommended weapon not found', async () => {
      User.findByPk = jest.fn().mockResolvedValue({ id: 1 });
      Monster.findByPk = jest.fn().mockResolvedValue({ id: 1 });
      Weapon.findAll = jest.fn().mockResolvedValue([]);
      Weapon.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/recommendations/generate')
        .send({
          userId: 1,
          monsterId: 1,
          preferences: {}
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Recommended weapon not found');
    });
  });

  describe('GET /monsters/:monsterId/analyze', () => {
    it('should analyze monster successfully', async () => {
      const mockMonster = {
        id: 1,
        name: 'Test Monster',
        species: 'Test Species'
      };
      const mockAnalysis = {
        analysis: 'Monster analysis',
        strategies: ['strategy1']
      };

      Monster.findByPk = jest.fn().mockResolvedValue(mockMonster);
      GeminiService.generateMonsterAnalysis.mockResolvedValue(mockAnalysis);

      const response = await request(app).get('/monsters/1/analyze');

      expect(response.status).toBe(200);
      expect(response.body.monster).toEqual(mockMonster);
      expect(response.body.analysis).toEqual(mockAnalysis);
    });

    it('should return 404 when monster not found', async () => {
      Monster.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/monsters/999/analyze');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Monster not found');
    });
  });

  describe('GET /monsters/:monsterId/best-weapon', () => {
    it('should return best weapon recommendation', async () => {
      const mockMonster = {
        id: 1,
        name: 'Test Monster',
        weaknesses: ['fire'],
        toJSON: () => ({ id: 1, name: 'Test Monster', weaknesses: ['fire'] })
      };
      const mockWeapons = [
        {
          id: 1,
          name: 'Fire Sword',
          element: 'fire',
          damage: 100,
          rarity: 5,
          toJSON: () => ({ id: 1, name: 'Fire Sword', element: 'fire', damage: 100, rarity: 5 })
        }
      ];

      Monster.findByPk = jest.fn().mockResolvedValue(mockMonster);
      Weapon.findAll = jest.fn().mockResolvedValue(mockWeapons);
      Weapon.findByPk = jest.fn().mockResolvedValue(mockWeapons[0]);

      const response = await request(app).get('/monsters/1/best-weapon');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('monster');
      expect(response.body).toHaveProperty('recommendedWeapon');
      expect(response.body).toHaveProperty('recommendation');
    });

    it('should return 404 when monster not found', async () => {
      Monster.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/monsters/999/best-weapon');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Monster not found');
    });

    it('should return 404 when no weapons available', async () => {
      Monster.findByPk = jest.fn().mockResolvedValue({ id: 1 });
      Weapon.findAll = jest.fn().mockResolvedValue([]);

      const response = await request(app).get('/monsters/1/best-weapon');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No weapons available');
    });
  });

  describe('DELETE /recommendations/:id', () => {
    it('should delete recommendation successfully', async () => {
      const mockRecommendation = {
        id: 1,
        destroy: jest.fn().mockResolvedValue()
      };

      Recommendation.findByPk = jest.fn().mockResolvedValue(mockRecommendation);

      const response = await request(app).delete('/recommendations/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Recommendation deleted successfully');
      expect(mockRecommendation.destroy).toHaveBeenCalledTimes(1);
    });

    it('should return 404 when recommendation not found', async () => {
      Recommendation.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/recommendations/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Recommendation not found');
    });
  });
});