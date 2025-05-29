const request = require('supertest');
const express = require('express');
const MonsterController = require('../../controllers/monsterController');
const { Monster } = require('../../models');

// Mock the Monster model
jest.mock('../../models', () => ({
  Monster: {
    findAll: jest.fn()
  }
}));

describe('MonsterController', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/monsters', MonsterController.monsters);
    
    jest.clearAllMocks();
  });

  describe('GET /monsters', () => {
    it('should return all monsters successfully', async () => {
      const mockMonsters = [
        {
          id: 1,
          name: 'Rathalos',
          species: 'Flying Wyvern',
          description: 'A fierce flying wyvern with fire attacks',
          weaknesses: ['water', 'dragon'],
          imageUrl: 'https://example.com/rathalos.jpg'
        },
        {
          id: 2,
          name: 'Diablos',
          species: 'Brute Wyvern',
          description: 'A powerful horned wyvern',
          weaknesses: ['ice', 'water'],
          imageUrl: 'https://example.com/diablos.jpg'
        },
        {
          id: 3,
          name: 'Kirin',
          species: 'Elder Dragon',
          description: 'A lightning-fast elder dragon',
          weaknesses: ['fire'],
          imageUrl: 'https://example.com/kirin.jpg'
        }
      ];
      
      Monster.findAll.mockResolvedValue(mockMonsters);
      
      const response = await request(app).get('/monsters');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMonsters);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].name).toBe('Rathalos');
      expect(response.body[1].species).toBe('Brute Wyvern');
      expect(response.body[2].weaknesses).toContain('fire');
      expect(Monster.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no monsters exist', async () => {
      Monster.findAll.mockResolvedValue([]);
      
      const response = await request(app).get('/monsters');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(response.body).toHaveLength(0);
      expect(Monster.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database connection failed');
      Monster.findAll.mockRejectedValue(mockError);
      
      // Mock next function to capture error
      const mockNext = jest.fn();
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await MonsterController.monsters(req, res, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(Monster.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return monsters with all required fields', async () => {
      const mockMonster = {
        id: 1,
        name: 'Zinogre',
        species: 'Fanged Wyvern',
        description: 'A thunder wolf wyvern',
        weaknesses: ['ice', 'water'],
        imageUrl: 'https://example.com/zinogre.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      };
      
      Monster.findAll.mockResolvedValue([mockMonster]);
      
      const response = await request(app).get('/monsters');
      
      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('species');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('weaknesses');
      expect(response.body[0]).toHaveProperty('imageUrl');
      expect(Array.isArray(response.body[0].weaknesses)).toBe(true);
    });
  });
});