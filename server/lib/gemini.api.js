const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

class GeminiService {
  static async generateWeaponRecommendation(userPreferences, monsters, weapons) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Create a list of available weapon IDs and names for the AI
      const weaponList = weapons.map(w => `ID: ${w.id}, Name: ${w.name}, Element: ${w.element}, Damage: ${w.damage}`).join('\n');
      
      const prompt = `
        You are a Monster Hunter expert. Based on the following data, recommend the best weapon for the user.
        
        User Preferences: ${JSON.stringify(userPreferences)}
        Target Monster: ${JSON.stringify(monsters[0])}
        
        Available Weapons (you MUST choose from these exact IDs):
        ${weaponList}
        
        IMPORTANT: You must select a weaponId from the list above. Do not make up weapon IDs.
        
        Please provide a recommendation in JSON format:
        {
          "weaponId": "actual_weapon_id_from_list_above",
          "reasoning": "detailed explanation"
        }
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {
          weaponId: null,
          reasoning: text
        };
      }
    } catch (error) {
      console.error("Error generating weapon recommendation:", error);
      throw new Error("Failed to generate recommendation");
    }
  }
  
  static async generateMonsterAnalysis(monster) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        Analyze this monster from Monster Hunter and provide strategic advice:
        
        Monster: ${JSON.stringify(monster)}
        
        Please provide analysis in JSON format:
        {
          "strengths": ["list of monster strengths"],
          "weaknesses": ["list of monster weaknesses"],
          "recommendedElements": ["list of effective elements"],
          "huntingStrategy": "detailed hunting strategy",
          "difficulty": "rating from 1-10"
        }
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return {
          strengths: [],
          weaknesses: monster.weaknesses || [],
          recommendedElements: [],
          huntingStrategy: text,
          difficulty: "N/A"
        };
      }
    } catch (error) {
      console.error("Error generating monster analysis:", error);
      throw new Error("Failed to generate monster analysis");
    }
  }
}

module.exports = GeminiService;
