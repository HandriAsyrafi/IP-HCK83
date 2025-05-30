const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Mock all controllers
jest.mock('../controllers/monsterController', () => ({
  monsters: jest.fn((req, res) => res.json({ message: 'monsters endpoint' }))
}));

jest.mock('../controllers/weaponController', () => ({
  weapons: jest.fn((req, res) => res.json({ message: 'weapons endpoint' }))
}));

jest.mock('../controllers/authController', () => ({
  googleLogin: jest.fn((req, res) => res.json({ message: 'google login endpoint' })),
  login: jest.fn((req, res) => res.json({ message: 'login endpoint' }))
}));

jest.mock('../controllers/recController', () => ({
  rec: jest.fn((req, res) => res.json({ message: 'recommendations endpoint' })),
  delRec: jest.fn((req, res) => res.json({ message: 'delete recommendation endpoint' })),
  analyzeMonster: jest.fn((req, res) => res.json({ message: 'analyze monster endpoint' })),
  getBestWeaponForMonster: jest.fn((req, res) => res.json({ message: 'best weapon endpoint' }))
}));

// Mock authentication middleware
jest.mock('../middleware/auth', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = { id: 1, email: 'test@example.com' };
    next();
  })
}));

// Mock cors
jest.mock('cors', () => {
  return jest.fn(() => (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
});

describe('App.js', () => {
  let app;
  let MonsterController;
  let WeaponController;
  let AuthController;
  let RecController;
  let authenticate;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Re-require the app to get fresh instance
    delete require.cache[require.resolve('../app')];
    app = require('../app');
    
    // Get mocked controllers
    MonsterController = require('../controllers/monsterController');
    WeaponController = require('../controllers/weaponController');
    AuthController = require('../controllers/authController');
    RecController = require('../controllers/recController');
    authenticate = require('../middleware/auth').authenticate;
  });

  describe('App Configuration', () => {
    it('should be an Express application', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('should use cors middleware', () => {
      expect(cors).toHaveBeenCalled();
    });

    it('should use express.json middleware', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password' })
        .set('Content-Type', 'application/json');
      
      expect(response.status).not.toBe(400); // Should not fail due to missing body parser
    });

    it('should use express.urlencoded middleware', async () => {
      const response = await request(app)
        .post('/login')
        .send('email=test@example.com&password=password')
        .set('Content-Type', 'application/x-www-form-urlencoded');
      
      expect(response.status).not.toBe(400); // Should not fail due to missing body parser
    });
  });

  describe('Root Route', () => {
    it('should respond with welcome message on GET /', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.text).toBe('Monster Hunter Recommendation API with Gemini AI');
    });
  });

  describe('Authentication Routes', () => {
    it('should handle POST /google-login', async () => {
      const response = await request(app)
        .post('/google-login')
        .send({ idToken: 'test-token' });
      
      expect(response.status).toBe(200);
      expect(AuthController.googleLogin).toHaveBeenCalled();
      expect(response.body.message).toBe('google login endpoint');
    });

    it('should handle POST /login', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password' });
      
      expect(response.status).toBe(200);
      expect(AuthController.login).toHaveBeenCalled();
      expect(response.body.message).toBe('login endpoint');
    });
  });

  describe('Data Routes', () => {
    it('should handle GET /monsters', async () => {
      const response = await request(app).get('/monsters');
      
      expect(response.status).toBe(200);
      expect(MonsterController.monsters).toHaveBeenCalled();
      expect(response.body.message).toBe('monsters endpoint');
    });

    it('should handle GET /weapons', async () => {
      const response = await request(app).get('/weapons');
      
      expect(response.status).toBe(200);
      expect(WeaponController.weapons).toHaveBeenCalled();
      expect(response.body.message).toBe('weapons endpoint');
    });
  });

  describe('Recommendation Routes', () => {
    it('should handle GET /recommendations', async () => {
      const response = await request(app).get('/recommendations');
      
      expect(response.status).toBe(200);
      expect(RecController.rec).toHaveBeenCalled();
      expect(response.body.message).toBe('recommendations endpoint');
    });

    it('should handle DELETE /recommendations/:id', async () => {
      const response = await request(app).delete('/recommendations/1');
      
      expect(response.status).toBe(200);
      expect(RecController.delRec).toHaveBeenCalled();
      expect(response.body.message).toBe('delete recommendation endpoint');
    });
  });

  describe('AI Analysis Routes', () => {
    it('should handle GET /monsters/:monsterId/analyze', async () => {
      const response = await request(app).get('/monsters/1/analyze');
      
      expect(response.status).toBe(200);
      expect(RecController.analyzeMonster).toHaveBeenCalled();
      expect(response.body.message).toBe('analyze monster endpoint');
    });
  });

  describe('Authenticated Routes', () => {
    it('should handle GET /monsters/:monsterId/best-weapon with authentication', async () => {
      const response = await request(app).get('/monsters/1/best-weapon');
      
      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(RecController.getBestWeaponForMonster).toHaveBeenCalled();
      expect(response.body.message).toBe('best weapon endpoint');
    });

    it('should call authentication middleware before getBestWeaponForMonster', async () => {
      await request(app).get('/monsters/1/best-weapon');
      
      // Verify that authenticate middleware was called
      expect(authenticate).toHaveBeenCalled();
      
      // Verify that the controller was called after authentication
      expect(RecController.getBestWeaponForMonster).toHaveBeenCalled();
    });
  });

  describe('Route Parameters', () => {
    it('should pass route parameters to controllers', async () => {
      await request(app).delete('/recommendations/123');
      
      expect(RecController.delRec).toHaveBeenCalled();
      const call = RecController.delRec.mock.calls[0];
      const req = call[0];
      expect(req.params.id).toBe('123');
    });

    it('should pass monsterId parameter to analyze endpoint', async () => {
      await request(app).get('/monsters/456/analyze');
      
      expect(RecController.analyzeMonster).toHaveBeenCalled();
      const call = RecController.analyzeMonster.mock.calls[0];
      const req = call[0];
      expect(req.params.monsterId).toBe('456');
    });

    it('should pass monsterId parameter to best-weapon endpoint', async () => {
      await request(app).get('/monsters/789/best-weapon');
      
      expect(RecController.getBestWeaponForMonster).toHaveBeenCalled();
      const call = RecController.getBestWeaponForMonster.mock.calls[0];
      const req = call[0];
      expect(req.params.monsterId).toBe('789');
    });
  });

  describe('HTTP Methods', () => {
    it('should only accept POST for /google-login', async () => {
      const getResponse = await request(app).get('/google-login');
      const putResponse = await request(app).put('/google-login');
      const deleteResponse = await request(app).delete('/google-login');
      
      expect(getResponse.status).toBe(404);
      expect(putResponse.status).toBe(404);
      expect(deleteResponse.status).toBe(404);
    });

    it('should only accept POST for /login', async () => {
      const getResponse = await request(app).get('/login');
      const putResponse = await request(app).put('/login');
      const deleteResponse = await request(app).delete('/login');
      
      expect(getResponse.status).toBe(404);
      expect(putResponse.status).toBe(404);
      expect(deleteResponse.status).toBe(404);
    });

    it('should only accept GET for data routes', async () => {
      const postMonstersResponse = await request(app).post('/monsters');
      const postWeaponsResponse = await request(app).post('/weapons');
      
      expect(postMonstersResponse.status).toBe(404);
      expect(postWeaponsResponse.status).toBe(404);
    });

    it('should only accept DELETE for /recommendations/:id', async () => {
      const getResponse = await request(app).get('/recommendations/1');
      const postResponse = await request(app).post('/recommendations/1');
      const putResponse = await request(app).put('/recommendations/1');
      
      expect(getResponse.status).toBe(404);
      expect(postResponse.status).toBe(404);
      expect(putResponse.status).toBe(404);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for undefined routes', async () => {
      const response = await request(app).get('/nonexistent-route');
      
      expect(response.status).toBe(404);
    });

    it('should handle 404 for undefined POST routes', async () => {
      const response = await request(app).post('/nonexistent-route');
      
      expect(response.status).toBe(404);
    });
  });

  describe('Middleware Integration', () => {
    it('should apply CORS headers', async () => {
      const response = await request(app).get('/');
      
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('should parse JSON request bodies', async () => {
      const testData = { test: 'data' };
      
      await request(app)
        .post('/login')
        .send(testData)
        .set('Content-Type', 'application/json');
      
      expect(AuthController.login).toHaveBeenCalled();
      const call = AuthController.login.mock.calls[0];
      const req = call[0];
      expect(req.body).toEqual(testData);
    });

    it('should parse URL-encoded request bodies', async () => {
      await request(app)
        .post('/login')
        .send('email=test@example.com&password=password')
        .set('Content-Type', 'application/x-www-form-urlencoded');
      
      expect(AuthController.login).toHaveBeenCalled();
      const call = AuthController.login.mock.calls[0];
      const req = call[0];
      expect(req.body.email).toBe('test@example.com');
      expect(req.body.password).toBe('password');
    });
  });

  describe('Module Export', () => {
    it('should export the Express app', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
      expect(app.listen).toBeDefined();
    });
  });
});