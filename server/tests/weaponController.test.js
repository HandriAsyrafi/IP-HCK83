const request = require('supertest');
const express = require('express');
const WeaponController = require('../controllers/weaponController');
const { Weapon } = require('../models');
require('./setup');

const app = express();
app.use(express.json());
app.get('/weapons', WeaponController.weapons);

describe('WeaponController', () => {
  beforeEach(async () => {
    await Weapon.bulkCreate([
      {
        name: 'Iron Sword',
        kind: 'Great Sword',
        rarity: 1,
        damage: 100,
        element: 'none',
        damageElement: 0
      },
      {
        name: 'Fire Blade',
        kind: 'Long Sword',
        rarity: 3,
        damage: 150,
        element: 'fire',
        damageElement: 25
      }
    ]);
  });

  describe('GET /weapons', () => {
    it('should return all weapons', async () => {
      const response = await request(app).get('/weapons');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'Iron Sword');
      expect(response.body[1]).toHaveProperty('name', 'Fire Blade');
    });

    it('should return empty array when no weapons exist', async () => {
      await Weapon.destroy({ where: {} });
      const response = await request(app).get('/weapons');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });
});