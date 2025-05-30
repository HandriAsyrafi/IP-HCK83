const request = require("supertest");
const express = require("express");
const RecController = require("../../controllers/recController");
const { Recommendation, Weapon, User, Monster } = require("../../models");
const GeminiService = require("../../lib/gemini.api");

// Mock dependencies
jest.mock("../../models", () => ({
  Recommendation: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
  Weapon: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
  Monster: {
    findByPk: jest.fn(),
  },
}));

jest.mock("../../lib/gemini.api", () => ({
  generateWeaponRecommendation: jest.fn(),
  generateMonsterAnalysis: jest.fn(),
}));

describe("RecController", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Setup routes
    app.get("/recommendations", RecController.rec);
    app.post("/recommendations/generate", RecController.generateRecommendation);
    app.get("/monsters/:monsterId/analyze", RecController.analyzeMonster);
    app.delete("/recommendations/:id", RecController.delRec);
    app.get(
      "/monsters/:monsterId/best-weapon",
      RecController.getBestWeaponForMonster
    );

    jest.clearAllMocks();
  });

  describe("GET /recommendations", () => {
    it("should return all recommendations with includes", async () => {
      const mockRecommendations = [
        {
          id: 1,
          userId: 1,
          weaponId: 1,
          reasoning: "Great for fire damage",
          User: { id: 1, username: "testuser", email: "test@example.com" },
          Weapon: { id: 1, name: "Fire Sword", damage: 1000, element: "fire" },
        },
        {
          id: 2,
          userId: 2,
          weaponId: 2,
          reasoning: "Excellent ice damage",
          User: { id: 2, username: "user2", email: "user2@example.com" },
          Weapon: { id: 2, name: "Ice Hammer", damage: 1200, element: "ice" },
        },
      ];

      Recommendation.findAll.mockResolvedValue(mockRecommendations);

      const response = await request(app).get("/recommendations");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecommendations);
      expect(response.body).toHaveLength(2);
      expect(Recommendation.findAll).toHaveBeenCalledWith({
        include: [Weapon, User],
      });
    });

    it("should handle database errors", async () => {
      Recommendation.findAll.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/recommendations");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Failed to fetch recommendations");
    });
  });

  describe("POST /recommendations/generate", () => {
    const mockUser = { id: 1, username: "testuser" };
    const mockMonster = {
      id: 1,
      name: "Rathalos",
      weaknesses: ["water", "dragon"],
    };
    const mockWeapons = [
      { id: 1, name: "Water Sword", element: "water", damage: 1000 },
      { id: 2, name: "Dragon Lance", element: "dragon", damage: 1100 },
    ];
    const mockAiRecommendation = {
      weaponId: 1,
      reasoning: "Water element is effective against Rathalos",
    };

    it("should generate recommendation successfully", async () => {
      const mockRecommendation = {
        id: 1,
        userId: 1,
        weaponId: 1,
        reasoning: "Water element is effective against Rathalos",
        User: mockUser,
        Weapon: mockWeapons[0],
      };

      User.findByPk.mockResolvedValue(mockUser);
      Monster.findByPk.mockResolvedValue(mockMonster);
      Weapon.findAll.mockResolvedValue(mockWeapons);
      Weapon.findByPk.mockResolvedValue(mockWeapons[0]);
      GeminiService.generateWeaponRecommendation.mockResolvedValue(
        mockAiRecommendation
      );
      Recommendation.create.mockResolvedValue({ id: 1 });
      Recommendation.findByPk.mockResolvedValue(mockRecommendation);

      const response = await request(app)
        .post("/recommendations/generate")
        .send({
          userId: 1,
          monsterId: 1,
          preferences: { playstyle: "aggressive" },
        });

      expect(response.status).toBe(201);
      expect(response.body.recommendation).toEqual(mockRecommendation);
      expect(response.body.aiAnalysis).toEqual(mockAiRecommendation);
      expect(GeminiService.generateWeaponRecommendation).toHaveBeenCalledWith(
        { playstyle: "aggressive" },
        [mockMonster],
        mockWeapons
      );
    });

    it("should return 404 when user not found", async () => {
      User.findByPk.mockResolvedValue(null);
      Monster.findByPk.mockResolvedValue(mockMonster);

      const response = await request(app)
        .post("/recommendations/generate")
        .send({
          userId: 999,
          monsterId: 1,
          preferences: {},
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User or Monster not found");
    });

    it("should return 404 when monster not found", async () => {
      User.findByPk.mockResolvedValue(mockUser);
      Monster.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .post("/recommendations/generate")
        .send({
          userId: 1,
          monsterId: 999,
          preferences: {},
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User or Monster not found");
    });

    it("should return 404 when recommended weapon not found", async () => {
      User.findByPk.mockResolvedValue(mockUser);
      Monster.findByPk.mockResolvedValue(mockMonster);
      Weapon.findAll.mockResolvedValue(mockWeapons);
      Weapon.findByPk.mockResolvedValue(null);
      GeminiService.generateWeaponRecommendation.mockResolvedValue(
        mockAiRecommendation
      );

      const response = await request(app)
        .post("/recommendations/generate")
        .send({
          userId: 1,
          monsterId: 1,
          preferences: {},
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Recommended weapon not found");
    });
  });

  describe("GET /monsters/:monsterId/analyze", () => {
    it("should analyze monster successfully", async () => {
      const mockMonster = {
        id: 1,
        name: "Rathalos",
        species: "Flying Wyvern",
      };
      const mockAnalysis = {
        strengths: ["Fire attacks", "Aerial mobility"],
        weaknesses: ["Water damage", "Dragon element"],
        strategy: "Target the wings to ground it",
      };

      Monster.findByPk.mockResolvedValue(mockMonster);
      GeminiService.generateMonsterAnalysis.mockResolvedValue(mockAnalysis);

      const response = await request(app).get("/monsters/1/analyze");

      expect(response.status).toBe(200);
      expect(response.body.monster).toEqual(mockMonster);
      expect(response.body.analysis).toEqual(mockAnalysis);
      expect(Monster.findByPk).toHaveBeenCalledWith("1");
      expect(GeminiService.generateMonsterAnalysis).toHaveBeenCalledWith(
        mockMonster
      );
    });

    it("should return 404 when monster not found", async () => {
      Monster.findByPk.mockResolvedValue(null);

      const response = await request(app).get("/monsters/999/analyze");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Monster not found");
      expect(GeminiService.generateMonsterAnalysis).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /recommendations/:id", () => {
    it("should delete recommendation successfully", async () => {
      const mockRecommendation = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(),
      };

      Recommendation.findByPk.mockResolvedValue(mockRecommendation);

      const response = await request(app).delete("/recommendations/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Recommendation deleted successfully");
      expect(Recommendation.findByPk).toHaveBeenCalledWith("1");
      expect(mockRecommendation.destroy).toHaveBeenCalled();
    });

    it("should return 404 when recommendation not found", async () => {
      Recommendation.findByPk.mockResolvedValue(null);

      const response = await request(app).delete("/recommendations/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Recommendation not found");
    });
  });

  describe("GET /monsters/:monsterId/best-weapon", () => {
    const mockMonster = {
      id: 1,
      name: "Rathalos",
      species: "Flying Wyvern",
      weaknesses: ["water", "dragon"],
    };
    const mockWeapons = [
      { id: 1, name: "Water Sword", element: "water", damage: 1000, rarity: 7 },
      { id: 2, name: "Fire Lance", element: "fire", damage: 1100, rarity: 6 },
    ];

    it("should return best weapon recommendation", async () => {
      const mockAiRecommendation = {
        weaponId: 1,
        reasoning: "Water element is super effective",
      };

      Monster.findByPk.mockResolvedValue(mockMonster);
      Weapon.findAll.mockResolvedValue(mockWeapons);
      GeminiService.generateWeaponRecommendation.mockResolvedValue(
        mockAiRecommendation
      );
      Weapon.findByPk.mockResolvedValue(mockWeapons[0]);
      Recommendation.create.mockResolvedValue({ id: 1 });

      const response = await request(app).get("/monsters/1/best-weapon");

      expect(response.status).toBe(200);
      expect(response.body.monster.id).toBe(1);
      expect(response.body.recommendedWeapon.id).toBe(1);
      expect(response.body.recommendation.reasoning).toBe(
        "Water element is super effective"
      );
      expect(response.body.recommendation.effectivenessScore).toBeGreaterThan(
        0
      );
    });

    it("should filter weapons by rarity when specified", async () => {
      Monster.findByPk.mockResolvedValue(mockMonster);
      Weapon.findAll.mockResolvedValue(
        mockWeapons.filter((w) => w.rarity === 7)
      );

      const response = await request(app).get(
        "/monsters/1/best-weapon?rarity=7"
      );

      expect(Weapon.findAll).toHaveBeenCalledWith({
        where: { rarity: 7 },
      });
    });

    it("should return 404 when no weapons available", async () => {
      Monster.findByPk.mockResolvedValue(mockMonster);
      Weapon.findAll.mockResolvedValue([]);

      const response = await request(app).get("/monsters/1/best-weapon");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("No weapons available");
    });
  });
});
