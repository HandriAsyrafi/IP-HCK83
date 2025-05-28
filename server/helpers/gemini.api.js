import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"; // Import dotenv

dotenv.config();

const ai = new GoogleGenerativeAI({
  apiKey: "AIzaSyAN7LxJkJm-2luxAb_gnbBchA-pRuBVpSc",
});

async function generateContent(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20", // Using gemini-1.5-flash as gemini-2.0-flash is not a standard model name.
      contents: prompt, // The `contents` field expects an array of `Part` objects.
    });
    const text = response.response.text();
    // console.log(text);
    return text;
  } catch (error) {
    console.log(error);
  }
}

main();
