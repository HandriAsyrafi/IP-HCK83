const request = require('supertest');
const express = require('express');
const WeaponController = require('../../controllers/weaponController');
const { Weapon } = require('../../models');

// Mock the Weapon model
jest.mock('../../models', () => ({
  Weapon: {
    findAll: jest.fn()
  }
}));

describe('WeaponController', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/weapons', WeaponController.weapons);
    
    jest.clearAllMocks();
  });

  describe('GET /weapons', () => {
    it('should return all weapons successfully', async () => {
      const mockWeapons = [
        {
          id: 1,
          name: 'Rathalos Edge',
          kind: 'Great Sword',
          rarity: 7,
          damage: 1344,
          element: 'fire',
          damageElement: 210
        },
        {
          id: 2,
          name: 'Diablos Crusher',
          kind: 'Hammer',
          rarity: 6,
          damage: 1248,
          element: null,
          damageElement: 0
        },
        {
          id: 3,
          name: 'Kirin Thundersword',
          kind: 'Long Sword',
          rarity: 8,
          damage: 1056,
          element: 'thunder',
          damageElement: 270
        }
      ];
      
      Weapon.findAll.mockResolvedValue(mockWeapons);
      
      const response = await request(app).get('/weapons');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockWeapons);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].name).toBe('Rathalos Edge');
      expect(response.body[1].kind).toBe('Hammer');
      expect(response.body[2].element).toBe('thunder');
      expect(Weapon.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no weapons exist', async () => {
      Weapon.findAll.mockResolvedValue([]);
      
      const response = await request(app).get('/weapons');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(response.body).toHaveLength(0);
      expect(Weapon.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database connection failed');
      Weapon.findAll.mockRejectedValue(mockError);
      
      // Mock next function to capture error
      const mockNext = jest.fn();
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await WeaponController.weapons(req, res, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(Weapon.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return weapons with all required fields', async () => {
      const mockWeapon = {
        id: 1,
        name: 'Test Weapon',
        kind: 'Sword and Shield',
        rarity: 5,
        damage: 896,
        element: 'water',
        damageElement: 180,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };
      
      Weapon.findAll.mockResolvedValue([mockWeapon]);
      
      const response = await request(app).get('/weapons');
      
      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('kind');
      expect(response.body[0]).toHaveProperty('rarity');
      expect(response.body[0]).toHaveProperty('damage');
      expect(response.body[0]).toHaveProperty('element');
      expect(response.body[0]).toHaveProperty('damageElement');
      expect(typeof response.body[0].rarity).toBe('number');
      expect(typeof response.body[0].damage).toBe('number');
    });

    it('should handle weapons with different rarities', async () => {
      const mockWeapons = [
        { id: 1, name: 'Common Sword', rarity: 1, damage: 100 },
        { id: 2, name: 'Rare Blade', rarity: 5, damage: 500 },
        { id: 3, name: 'Legendary Weapon', rarity: 10, damage: 1000 }
      ];
      
      Weapon.findAll.mockResolvedValue(mockWeapons);
      
      const response = await request(app).get('/weapons');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body.find(w => w.rarity === 1)).toBeDefined();
      expect(response.body.find(w => w.rarity === 5)).toBeDefined();
      expect(response.body.find(w => w.rarity === 10)).toBeDefined();
    });
  });
});