const { Recommendation, Weapon, User, Monster } = require("../models");
const GeminiService = require("../lib/gemini.api");

class RecController {
  static async rec(req, res, next) {
    try {
      const recommendations = await Recommendation.findAll({
        include: [Weapon, User],
      });

      res.status(200).json(recommendations);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  }

  static async generateRecommendation(req, res, next) {
    try {
      const { userId, monsterId, preferences } = req.body;
      
      // Fetch user, monster, and weapons data
      const user = await User.findByPk(userId);
      const monster = await Monster.findByPk(monsterId);
      const weapons = await Weapon.findAll();
      
      if (!user || !monster) {
        return res.status(404).json({ error: "User or Monster not found" });
      }
      
      // Generate recommendation using Gemini AI
      const aiRecommendation = await GeminiService.generateWeaponRecommendation(
        preferences,
        [monster],
        weapons
      );
      
      // Find the recommended weapon
      const recommendedWeapon = await Weapon.findByPk(aiRecommendation.weaponId);
      
      if (!recommendedWeapon) {
        return res.status(404).json({ error: "Recommended weapon not found" });
      }
      
      // Save recommendation to database
      const recommendation = await Recommendation.create({
        userId: userId,
        weaponId: aiRecommendation.weaponId,
        reasoning: aiRecommendation.reasoning
      });
      
      // Return recommendation with weapon details
      const result = await Recommendation.findByPk(recommendation.id, {
        include: [Weapon, User]
      });
      
      res.status(201).json({
        recommendation: result,
        aiAnalysis: aiRecommendation
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate recommendation" });
    }
  }
  
  static async analyzeMonster(req, res, next) {
    try {
      const { monsterId } = req.params;
      
      const monster = await Monster.findByPk(monsterId);
      
      if (!monster) {
        return res.status(404).json({ error: "Monster not found" });
      }
      
      const analysis = await GeminiService.generateMonsterAnalysis(monster);
      
      res.status(200).json({
        monster: monster,
        analysis: analysis
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to analyze monster" });
    }
  }

  static async delRec(req, res, next) {
    try {
      const { id } = req.params;
      
      const recommendation = await Recommendation.findByPk(id);
      
      if (!recommendation) {
        return res.status(404).json({ error: "Recommendation not found" });
      }
      
      await recommendation.destroy();
      
      res.status(200).json({ message: "Recommendation deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete recommendation" });
    }
  }
}

module.exports = RecController;
