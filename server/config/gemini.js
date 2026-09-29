import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let ai = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_google_gemini_api_key') {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
    console.log("✅ Google Gen AI SDK initialized with API key.");
  } catch (err) {
    console.warn("⚠️ Failed to initialize Google Gen AI SDK:", err.message);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY environment variable is missing or placeholder. Running in fallback simulation mode.");
}

export { ai };

// Helper for structured JSON generations using gemini-2.5-flash
export const generateStructuredAI = async ({ systemInstruction, prompt, responseSchema, fallbackGenerator }) => {
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.3,
        }
      });

      if (response && response.text) {
        return JSON.parse(response.text);
      }
    } catch (err) {
      console.error("❌ Gemini API invocation error, switching to fallback:", err.message);
    }
  }

  // Graceful fallback simulation if API key is absent or request fails
  if (fallbackGenerator) {
    return fallbackGenerator();
  }

  throw new Error("AI Generation failed and no fallback was provided.");
};
