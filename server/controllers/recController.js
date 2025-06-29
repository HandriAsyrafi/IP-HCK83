const { User, Monster, Weapon, Recommendation } = require("../models");
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
      const recommendedWeapon = await Weapon.findByPk(
        aiRecommendation.weaponId
      );

      if (!recommendedWeapon) {
        return res.status(404).json({ error: "Recommended weapon not found" });
      }

      // Save recommendation to database
      const recommendation = await Recommendation.create({
        userId: userId,
        weaponId: aiRecommendation.weaponId,
        reasoning: aiRecommendation.reasoning,
      });

      // Return recommendation with weapon details
      const result = await Recommendation.findByPk(recommendation.id, {
        include: [Weapon, User],
      });

      res.status(201).json({
        recommendation: result,
        aiAnalysis: aiRecommendation,
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
        analysis: analysis,
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

  static async getBestWeaponForMonster(req, res, next) {
    try {
      const { monsterId } = req.params;
      const { rarity } = req.query; // Add this line to get rarity from query params
      const userId = req.user?.id || 1;

      // Fetch the specific monster
      const monster = await Monster.findByPk(monsterId);

      if (!monster) {
        return res.status(404).json({ error: "Monster not found" });
      }

      // Fetch weapons with optional rarity filter
      let weaponQuery = {};
      if (rarity) {
        weaponQuery.where = { rarity: parseInt(rarity) }; // Add rarity filter
      }
      const weapons = await Weapon.findAll(weaponQuery); // Modify this line

      if (weapons.length === 0) {
        return res.status(404).json({
          error: rarity
            ? `No weapons available with rarity ${rarity}`
            : "No weapons available",
        });
      }

      // Create a focused prompt for best weapon recommendation
      const preferences = {
        focus: "optimal_damage_and_effectiveness",
        priority: "monster_weaknesses",
        playstyle: "balanced",
      };

      // Generate AI recommendation using existing Gemini service
      const aiRecommendation = await GeminiService.generateWeaponRecommendation(
        preferences,
        [monster],
        weapons
      );

      // Parse the AI response to extract weapon ID
      let weaponId = null;
      let reasoning = aiRecommendation.reasoning;

      // Try to parse JSON from reasoning if it contains JSON
      try {
        if (reasoning.includes("```json")) {
          const jsonMatch = reasoning.match(/```json\s*({[\s\S]*?})\s*```/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[1]);
            weaponId = parsed.weaponId;
            reasoning = parsed.reasoning;
          }
        } else if (aiRecommendation.weaponId) {
          weaponId = aiRecommendation.weaponId;
        }
      } catch (parseError) {
        console.log("Failed to parse AI response:", parseError);
      }

      // Find the recommended weapon with full details
      let recommendedWeapon = null;
      if (weaponId) {
        recommendedWeapon = await Weapon.findByPk(weaponId);
      }

      // If AI recommended weapon not found, find best weapon based on monster weaknesses
      if (!recommendedWeapon) {
        console.log(`Weapon ID ${weaponId} not found, finding alternative...`);

        // Find weapons that match monster weaknesses
        const effectiveWeapons = weapons
          .map((weapon) => ({
            ...weapon.toJSON(),
            effectivenessScore: calculateEffectiveness(monster, weapon),
          }))
          .sort((a, b) => b.effectivenessScore - a.effectivenessScore);

        recommendedWeapon = effectiveWeapons[0]
          ? await Weapon.findByPk(effectiveWeapons[0].id)
          : weapons[0];

        // Update reasoning to explain the fallback
        reasoning = `Original AI recommendation (weapon ID ${weaponId}) was not found in database. Selected ${
          recommendedWeapon.name
        } as the best alternative based on effectiveness against ${
          monster.name
        }'s weaknesses: ${monster.weaknesses.join(", ")}.`;
      }

      if (!recommendedWeapon) {
        return res.status(404).json({
          error: "No suitable weapon found",
          fallback: {
            monster: monster,
            reasoning: reasoning,
            suggestion:
              "Consider weapons with elements that exploit monster weaknesses",
          },
        });
      }

      // Calculate effectiveness score
      const effectivenessScore = calculateEffectiveness(
        monster,
        recommendedWeapon
      );

      // Save recommendation to database (only if user is authenticated)
      let savedRecommendation = null;
      if (userId) {
        try {
          savedRecommendation = await Recommendation.create({
            userId: userId,
            weaponId: recommendedWeapon.id,
            reasoning: reasoning,
          });
          console.log(
            "Recommendation saved to database:",
            savedRecommendation.id
          );
        } catch (dbError) {
          console.log("Failed to save recommendation to database:", dbError);
          // Continue execution even if saving fails
        }
      } else {
        console.log(
          "No authenticated user - recommendation not saved to database"
        );
      }

      // Get alternative weapons
      const alternativeWeapons = await getAlternativeWeapons(
        monster,
        weapons,
        recommendedWeapon.id
      );

      // Return comprehensive recommendation
      res.status(200).json({
        monster: {
          id: monster.id,
          name: monster.name,
          species: monster.species,
          weaknesses: monster.weaknesses,
        },
        recommendedWeapon: {
          id: recommendedWeapon.id,
          name: recommendedWeapon.name,
          kind: recommendedWeapon.kind,
          rarity: recommendedWeapon.rarity,
          damage: recommendedWeapon.damage,
          element: recommendedWeapon.element,
          damageElement: recommendedWeapon.damageElement,
        },
        recommendation: {
          reasoning: reasoning,
          effectivenessScore: effectivenessScore,
          matchedWeaknesses: getMatchedWeaknesses(monster, recommendedWeapon),
          aiRecommendedId: weaponId,
          fallbackUsed: weaponId !== recommendedWeapon.id,

          savedToDatabase: savedRecommendation ? true : false,
          recommendationId: savedRecommendation ? savedRecommendation.id : null,
          requiresAuth: !userId, // Indicates if user needs to authenticate to save recommendations
        },
        alternativeWeapons: alternativeWeapons,
      });
    } catch (error) {
      console.error("Error getting best weapon for monster:", error);
      res.status(500).json({
        error: "Failed to get weapon recommendation",
        details: error.message,
      });
    }
  }

  // Add this method to the RecController class
  static async updateRecommendation(req, res) {
    try {
      const { id } = req.params;
      const { reasoning } = req.body;
      const userId = req.user.id;

      // Find the recommendation and check ownership
      const recommendation = await Recommendation.findOne({
        where: { id, userId },
      });

      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }

      // Update the recommendation
      await recommendation.update({ reasoning });

      // Fetch the updated recommendation with associations
      const updatedRecommendation = await Recommendation.findByPk(id, {
        include: [
          { model: User, attributes: ["email"] },
          { model: Weapon },
          { model: Monster },
        ],
      });

      res.status(200).json({
        message: "Recommendation updated successfully",
        recommendation: updatedRecommendation,
      });
    } catch (error) {
      console.error("Error updating recommendation:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

// Helper function to calculate effectiveness
function calculateEffectiveness(monster, weapon) {
  let score = 50; // Base score

  // Check if weapon element matches monster weaknesses
  if (monster.weaknesses && weapon.element) {
    if (monster.weaknesses.includes(weapon.element.toLowerCase())) {
      score += 30;
    }
  }

  // Factor in weapon damage and rarity
  score += (weapon.damage / 100) * 10;
  score += weapon.rarity * 2;

  return Math.min(100, Math.round(score));
}

// Helper function to get matched weaknesses
function getMatchedWeaknesses(monster, weapon) {
  if (!monster.weaknesses || !weapon.element) return [];

  return monster.weaknesses.filter(
    (weakness) => weakness.toLowerCase() === weapon.element.toLowerCase()
  );
}

// Helper function to get alternative weapons
async function getAlternativeWeapons(monster, allWeapons, excludeWeaponId) {
  // Filter out the recommended weapon and get top 3 alternatives
  const alternatives = allWeapons
    .filter((weapon) => weapon.id !== excludeWeaponId)
    .map((weapon) => ({
      ...weapon.toJSON(),
      effectivenessScore: calculateEffectiveness(monster, weapon),
    }))
    .sort((a, b) => b.effectivenessScore - a.effectivenessScore)
    .slice(0, 3);

  return alternatives;
}

module.exports = RecController;
