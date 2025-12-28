
import { GoogleGenAI, Type } from "@google/genai";
import { UtilityStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEnergyAdvice = async (data: UtilityStatus) => {
  try {
    const prompt = `Som en energiexpert, analysera följande data för ett hushåll och ge 3 korta, konkreta tips på svenska för att minska förbrukningen.
    Elförbrukning idag: ${data.electricity.currentUsage} kWh.
    Vattenförbrukning idag: ${data.water.currentUsage} liter.
    Håll svaret i JSON-format med ett fält 'tips' som är en array av strängar.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr).tips;
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      "Släck lampor i rum du inte vistas i.",
      "Kör endast fulla tvättmaskiner.",
      "Installera snålspolande munstycken på kranar."
    ];
  }
};
