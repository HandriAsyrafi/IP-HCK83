const request = require('supertest');
const express = require('express');
const WeaponController = require('../../controllers/weaponController');
const { Weapon } = require('../../models');

const app = express();
app.use(express.json());
app.get('/weapons', WeaponController.weapons);

describe('WeaponController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /weapons', () => {
    it('should return all weapons successfully', async () => {
      const mockWeapons = [
        {
          id: 1,
          name: 'Fire Sword',
          kind: 'Great Sword',
          rarity: 5,
          damage: 150,
          element: 'fire',
          damageElement: 'fire'
        },
        {
          id: 2,
          name: 'Ice Lance',
          kind: 'Lance',
          rarity: 4,
          damage: 120,
          element: 'ice',
          damageElement: 'ice'
        }
      ];

      Weapon.findAll = jest.fn().mockResolvedValue(mockWeapons);

      const response = await request(app).get('/weapons');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockWeapons);
      expect(Weapon.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no weapons exist', async () => {
      Weapon.findAll = jest.fn().mockResolvedValue([]);

      const response = await request(app).get('/weapons');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should handle database errors', async () => {
      Weapon.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/weapons');

      expect(response.status).toBe(500);
    });
  });
});