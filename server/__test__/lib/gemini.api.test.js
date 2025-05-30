const { GoogleGenerativeAI } = require('@google/generative-ai');
const GeminiService = require('../../lib/gemini.api');

// Mock the GoogleGenerativeAI
jest.mock('@google/generative-ai');

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('GeminiService', () => {
  let mockModel;
  let mockGenAI;
  let mockGenerateContent;
  let mockResponse;
  let mockResult;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock response chain
    mockResponse = {
      text: jest.fn()
    };
    
    mockResult = {
      response: mockResponse
    };
    
    mockGenerateContent = jest.fn().mockResolvedValue(mockResult);
    
    mockModel = {
      generateContent: mockGenerateContent
    };
    
    mockGenAI = {
      getGenerativeModel: jest.fn().mockReturnValue(mockModel)
    };
    
    GoogleGenerativeAI.mockImplementation(() => mockGenAI);
    
    // Mock environment variable
    process.env.GOOGLE_API_KEY = 'test-api-key';
  });

  describe('generateWeaponRecommendation', () => {
    const mockUserPreferences = {
      playstyle: 'aggressive',
      preferredWeaponType: 'sword'
    };
    
    const mockMonsters = [{
      id: 1,
      name: 'Rathalos',
      type: 'Flying Wyvern',
      weaknesses: ['Dragon', 'Thunder']
    }];
    
    const mockWeapons = [
      {
        id: 1,
        name: 'Dragon Sword',
        element: 'Dragon',
        damage: 150
      },
      {
        id: 2,
        name: 'Thunder Blade',
        element: 'Thunder',
        damage: 140
      }
    ];

    it('should successfully generate weapon recommendation with valid JSON response', async () => {
      const mockAIResponse = {
        weaponId: 1,
        reasoning: 'Dragon element is effective against Rathalos'
      };
      
      mockResponse.text.mockReturnValue(JSON.stringify(mockAIResponse));
      
      const result = await GeminiService.generateWeaponRecommendation(
        mockUserPreferences,
        mockMonsters,
        mockWeapons
      );
      
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
      expect(mockGenAI.getGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toEqual(mockAIResponse);
    });

    it('should handle invalid JSON response from AI', async () => {
      const invalidJsonResponse = 'This is not valid JSON';
      mockResponse.text.mockReturnValue(invalidJsonResponse);
      
      const result = await GeminiService.generateWeaponRecommendation(
        mockUserPreferences,
        mockMonsters,
        mockWeapons
      );
      
      expect(result).toEqual({
        weaponId: null,
        reasoning: invalidJsonResponse
      });
    });

    it('should include correct prompt with user preferences and monster data', async () => {
      mockResponse.text.mockReturnValue(JSON.stringify({ weaponId: 1, reasoning: 'test' }));
      
      await GeminiService.generateWeaponRecommendation(
        mockUserPreferences,
        mockMonsters,
        mockWeapons
      );
      
      const promptCall = mockGenerateContent.mock.calls[0][0];
      expect(promptCall).toContain(JSON.stringify(mockUserPreferences));
      expect(promptCall).toContain(JSON.stringify(mockMonsters[0]));
      expect(promptCall).toContain('ID: 1, Name: Dragon Sword, Element: Dragon, Damage: 150');
      expect(promptCall).toContain('ID: 2, Name: Thunder Blade, Element: Thunder, Damage: 140');
    });

    it('should throw error when AI service fails', async () => {
      const errorMessage = 'AI service unavailable';
      mockGenerateContent.mockRejectedValue(new Error(errorMessage));
      
      await expect(
        GeminiService.generateWeaponRecommendation(
          mockUserPreferences,
          mockMonsters,
          mockWeapons
        )
      ).rejects.toThrow('Failed to generate recommendation');
      
      expect(console.error).toHaveBeenCalledWith(
        'Error generating weapon recommendation:',
        expect.any(Error)
      );
    });

    it('should handle empty weapons array', async () => {
      mockResponse.text.mockReturnValue(JSON.stringify({ weaponId: null, reasoning: 'No weapons available' }));
      
      const result = await GeminiService.generateWeaponRecommendation(
        mockUserPreferences,
        mockMonsters,
        []
      );
      
      const promptCall = mockGenerateContent.mock.calls[0][0];
      expect(promptCall).toContain('Available Weapons (you MUST choose from these exact IDs):');
      expect(result.weaponId).toBeNull();
    });

    it('should handle multiple monsters (using first one)', async () => {
      const multipleMonsters = [
        ...mockMonsters,
        {
          id: 2,
          name: 'Diablos',
          type: 'Brute Wyvern',
          weaknesses: ['Ice', 'Water']
        }
      ];
      
      mockResponse.text.mockReturnValue(JSON.stringify({ weaponId: 1, reasoning: 'test' }));
      
      await GeminiService.generateWeaponRecommendation(
        mockUserPreferences,
        multipleMonsters,
        mockWeapons
      );
      
      const promptCall = mockGenerateContent.mock.calls[0][0];
      expect(promptCall).toContain(JSON.stringify(multipleMonsters[0]));
      expect(promptCall).not.toContain('Diablos');
    });
  });

  describe('generateMonsterAnalysis', () => {
    const mockMonster = {
      id: 1,
      name: 'Rathalos',
      type: 'Flying Wyvern',
      weaknesses: ['Dragon', 'Thunder'],
      habitat: 'Ancient Forest'
    };

    it('should successfully generate monster analysis with valid JSON response', async () => {
      const mockAIResponse = {
        strengths: ['Flight capability', 'Fire attacks'],
        weaknesses: ['Dragon element', 'Thunder element'],
        recommendedElements: ['Dragon', 'Thunder'],
        huntingStrategy: 'Target the wings to ground the monster',
        difficulty: '7'
      };
      
      mockResponse.text.mockReturnValue(JSON.stringify(mockAIResponse));
      
      const result = await GeminiService.generateMonsterAnalysis(mockMonster);
      
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
      expect(mockGenAI.getGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result).toEqual(mockAIResponse);
    });

    it('should handle invalid JSON response from AI', async () => {
      const invalidJsonResponse = 'This monster is very dangerous and hard to hunt';
      mockResponse.text.mockReturnValue(invalidJsonResponse);
      
      const result = await GeminiService.generateMonsterAnalysis(mockMonster);
      
      expect(result).toEqual({
        strengths: [],
        weaknesses: mockMonster.weaknesses,
        recommendedElements: [],
        huntingStrategy: invalidJsonResponse,
        difficulty: 'N/A'
      });
    });

    it('should include correct prompt with monster data', async () => {
      mockResponse.text.mockReturnValue(JSON.stringify({
        strengths: [],
        weaknesses: [],
        recommendedElements: [],
        huntingStrategy: 'test',
        difficulty: '5'
      }));
      
      await GeminiService.generateMonsterAnalysis(mockMonster);
      
      const promptCall = mockGenerateContent.mock.calls[0][0];
      expect(promptCall).toContain(JSON.stringify(mockMonster));
      expect(promptCall).toContain('Analyze this monster from Monster Hunter');
    });

    it('should throw error when AI service fails', async () => {
      const errorMessage = 'AI service unavailable';
      mockGenerateContent.mockRejectedValue(new Error(errorMessage));
      
      await expect(
        GeminiService.generateMonsterAnalysis(mockMonster)
      ).rejects.toThrow('Failed to generate monster analysis');
      
      expect(console.error).toHaveBeenCalledWith(
        'Error generating monster analysis:',
        expect.any(Error)
      );
    });

    it('should handle monster without weaknesses property', async () => {
      const monsterWithoutWeaknesses = {
        id: 2,
        name: 'Unknown Monster',
        type: 'Unknown'
      };
      
      const invalidJsonResponse = 'Analysis text';
      mockResponse.text.mockReturnValue(invalidJsonResponse);
      
      const result = await GeminiService.generateMonsterAnalysis(monsterWithoutWeaknesses);
      
      expect(result.weaknesses).toEqual([]);
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'TIMEOUT';
      mockGenerateContent.mockRejectedValue(timeoutError);
      
      await expect(
        GeminiService.generateMonsterAnalysis(mockMonster)
      ).rejects.toThrow('Failed to generate monster analysis');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing API key', async () => {
      delete process.env.GOOGLE_API_KEY;
      
      // Re-require the module to test initialization with missing API key
      jest.resetModules();
      const GeminiServiceNew = require('../../lib/gemini.api');
      
      const mockUserPreferences = { playstyle: 'aggressive' };
      const mockMonsters = [{ id: 1, name: 'Test Monster' }];
      const mockWeapons = [{ id: 1, name: 'Test Weapon' }];
      
      await expect(
        GeminiServiceNew.generateWeaponRecommendation(
          mockUserPreferences,
          mockMonsters,
          mockWeapons
        )
      ).rejects.toThrow();
    });

    it('should handle API rate limiting', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.status = 429;
      mockGenerateContent.mockRejectedValue(rateLimitError);
      
      await expect(
        GeminiService.generateWeaponRecommendation(
          { playstyle: 'aggressive' },
          [{ id: 1, name: 'Test Monster' }],
          [{ id: 1, name: 'Test Weapon' }]
        )
      ).rejects.toThrow('Failed to generate recommendation');
    });
  });

  describe('Model Configuration', () => {
    it('should use correct model version', async () => {
      mockResponse.text.mockReturnValue(JSON.stringify({ weaponId: 1, reasoning: 'test' }));
      
      await GeminiService.generateWeaponRecommendation(
        { playstyle: 'aggressive' },
        [{ id: 1, name: 'Test Monster' }],
        [{ id: 1, name: 'Test Weapon', element: 'Fire', damage: 100 }]
      );
      
      expect(mockGenAI.getGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
    });

    it('should initialize GoogleGenerativeAI with API key', () => {
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');
    });
  });

  describe('Response Processing', () => {
    it('should handle partial JSON in weapon recommendation', async () => {
      const partialJson = '{"weaponId": 1, "reasoning": "incomplete';
      mockResponse.text.mockReturnValue(partialJson);
      
      const result = await GeminiService.generateWeaponRecommendation(
        { playstyle: 'aggressive' },
        [{ id: 1, name: 'Test Monster' }],
        [{ id: 1, name: 'Test Weapon', element: 'Fire', damage: 100 }]
      );
      
      expect(result).toEqual({
        weaponId: null,
        reasoning: partialJson
      });
    });

    it('should handle partial JSON in monster analysis', async () => {
      const partialJson = '{"strengths": ["test"], "weaknesses":';
      mockResponse.text.mockReturnValue(partialJson);
      
      const result = await GeminiService.generateMonsterAnalysis({
        id: 1,
        name: 'Test Monster',
        weaknesses: ['Fire']
      });
      
      expect(result).toEqual({
        strengths: [],
        weaknesses: ['Fire'],
        recommendedElements: [],
        huntingStrategy: partialJson,
        difficulty: 'N/A'
      });
    });
  });
});