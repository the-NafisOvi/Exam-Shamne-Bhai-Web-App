import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getStudySuggestion(tasks: string[], exams: string[]) {
  if (!process.env.GEMINI_API_KEY) return "Bhai, AI key nai! Nijer buddhi tei poro.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a funny but helpful Bangladeshi study assistant. 
      The user has these tasks: ${tasks.join(", ")}. 
      Upcoming exams: ${exams.join(", ")}.
      Give a short, witty, and motivational suggestion in Bangla (Banglish or Bangla script is fine, but script is preferred). 
      Keep it under 30 words. Use student slang like 'bhai', 'chill', 'kopaiya'.`,
    });
    return response.text || "Bhai, matha kaj kortese na. Ektu pore try koro.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Bhai, AI o bhab nitese. Tumi pora shuru koro!";
  }
}
