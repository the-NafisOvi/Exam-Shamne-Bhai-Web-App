import { GoogleGenAI } from "@google/genai";
import { Task, Exam } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getStudySuggestion(tasks: Task[], exams: Exam[]) {
  if (!process.env.GEMINI_API_KEY) return "Bhai, AI key nai! Nijer buddhi tei poro.";

  const taskList = tasks.filter(t => !t.completed).map(t => t.title).join(", ");
  const examList = exams.map(e => `${e.courseName} (${e.courseCode}) on ${e.date}`).join(", ");

  try {
    const prompt = `
      You are "Exam Shamne Bhai", a motivational and slightly humorous study coach for a Bangladeshi student.
      Your tone is relatable, uses Bangladeshi student slang (Banglish/Bangla), and is encouraging but firm about studying.
      
      Pending Tasks: ${taskList || "None"}
      Upcoming Exams: ${examList || "None"}
      
      Instructions:
      1. Analyze the tasks and exams.
      2. Provide a study plan or suggestions in Bangla script.
      3. Use humor and student slang (e.g., "kopano", "chill", "pora baki", "exam shamne").
      4. If there's an exam soon, be more urgent.
      5. Keep it concise and use markdown for formatting (bold, lists).
      6. Address the user as "Bhai" or "Dost".
      7. Remind them that "Nafis Ovi" is watching their progress (just for fun).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text || "Bhai, matha kaj kortese na. Ektu pore try koro.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Bhai, AI o bhab nitese. Tumi pora shuru koro!";
  }
}
