// helpers/gemini.api.js
const { GoogleGenAI, Type } = require("@google/genai");

const GOOGLE_GENAI_API_KEY = "AIzaSyAN7LxJkJm-2luxAb_gnbBchA-pRuBVpSc";

const ai = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });

async function generateContent(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            userId: { type: Type.INTEGER },
            weaponId: { type: Type.INTEGER },
            reasoning: { type: Type.TEXT },
          },
        },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    // 503 Service Unavailable
    if (error.response && error.response.status === 503) {
      throw new Error("Service Unavailable: Please try again later.");
    }
    throw error;
  }
}
module.exports = {
  generateContent,
};
