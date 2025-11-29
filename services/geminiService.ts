import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "TypingBot", a helpful, professional, and friendly AI assistant for "Excellent Typing & Travels", a typing centre in the UAE.
Your goal is to assist customers with queries related to:
- UAE Visas (Golden Visa, Tourist Visa, Family Visa, Residence Visa)
- Emirates ID applications and renewals
- Medical test typing
- Flight tickets and travel insurance
- Business setup in Dubai/UAE

Guidelines:
1. Keep answers concise (under 80 words if possible) as this is displayed on a kiosk screen.
2. Be polite and professional.
3. If you don't know the exact current government fee, give a range or advise them to check with the counter staff.
4. Encourage them to speak to a human agent at the counter for complex cases.
5. Do not use markdown formatting like bold or lists extensively, keep it conversational text.
`;

class GeminiService {
  private ai: GoogleGenAI;
  private modelId = "gemini-2.5-flash";

  constructor() {
    const apiKey = process.env.API_KEY || ''; 
    this.ai = new GoogleGenAI({ apiKey });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: message,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          maxOutputTokens: 150, // Keep responses short for digital signage
        }
      });
      
      return response.text || "I apologize, I couldn't process that request. Please ask the staff.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      // User-friendly error message
      return "I am currently experiencing connection issues. Please speak to one of our agents at the counter for immediate assistance.";
    }
  }
}

export const geminiService = new GeminiService();