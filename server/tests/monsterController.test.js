const request = require('supertest');
const express = require('express');
const MonsterController = require('../controllers/monsterController');
const { Monster } = require('../models');
require('./setup');

const app = express();
app.use(express.json());
app.get('/monsters', MonsterController.monsters);

describe('MonsterController', () => {
  beforeEach(async () => {
    await Monster.bulkCreate([
      {
        name: 'Rathalos',
        species: 'Flying Wyvern',
        description: 'King of the skies',
        weaknesses: ['dragon', 'thunder']
      },
      {
        name: 'Diablos',
        species: 'Flying Wyvern',
        description: 'Desert tyrant',
        weaknesses: ['ice', 'water']
      }
    ]);
  });

  describe('GET /monsters', () => {
    it('should return all monsters', async () => {
      const response = await request(app).get('/monsters');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'Rathalos');
      expect(response.body[1]).toHaveProperty('name', 'Diablos');
    });

    it('should return empty array when no monsters exist', async () => {
      await Monster.destroy({ where: {} });
      const response = await request(app).get('/monsters');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });
});