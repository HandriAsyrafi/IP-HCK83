const request = require('supertest');
const express = require('express');
const MonsterController = require('../../controllers/monsterController');
const { Monster } = require('../../models');

const app = express();
app.use(express.json());
app.get('/monsters', MonsterController.monsters);

describe('MonsterController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /monsters', () => {
    it('should return all monsters successfully', async () => {
      const mockMonsters = [
        {
          id: 1,
          name: 'Rathalos',
          species: 'Flying Wyvern',
          description: 'King of the skies',
          weaknesses: ['dragon', 'thunder']
        },
        {
          id: 2,
          name: 'Diablos',
          species: 'Brute Wyvern',
          description: 'Desert tyrant',
          weaknesses: ['ice', 'water']
        }
      ];

      Monster.findAll = jest.fn().mockResolvedValue(mockMonsters);

      const response = await request(app).get('/monsters');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMonsters);
      expect(Monster.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no monsters exist', async () => {
      Monster.findAll = jest.fn().mockResolvedValue([]);

      const response = await request(app).get('/monsters');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should handle database errors', async () => {
      Monster.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/monsters');

      expect(response.status).toBe(500);
    });
  });
});