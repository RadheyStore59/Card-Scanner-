
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, ScanResult } from "../types";

export const extractBusinessCards = async (base64Images: string[]): Promise<Contact[]> => {
  // Use the pre-configured process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-flash-preview for the best balance of vision accuracy and extraction speed
  const model = 'gemini-3-flash-preview';
  
  const imageParts = base64Images.map((img) => {
    // Cleanly extract just the base64 data portion
    const base64Data = img.includes('base64,') ? img.split('base64,')[1] : img;
    const mimeMatch = img.match(/^data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    
    return {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };
  });

  const prompt = `You are a professional business card scanner. 
Analyze the provided images and extract structured contact information for EVERY card found.
Return the data as a JSON object with a "contacts" array.

Fields to extract:
- name (Full Name)
- title (Job Position)
- company (Company/Organization)
- email (Email address)
- phone (Phone number)
- website (Website URL)
- address (Full physical address)
- linkedin (LinkedIn profile link or username)
- notes (Slogan, certifications, or other details)

Rules:
1. Return ONLY valid JSON.
2. Use empty strings "" for missing values.
3. If multiple people are on one card or multiple cards are present, create an entry for each.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { 
        parts: [
          ...imageParts,
          { text: prompt }
        ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            contacts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  website: { type: Type.STRING },
                  address: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  notes: { type: Type.STRING }
                },
                required: ["name"]
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("The AI returned an empty response. Please try a clearer photo.");
    }

    const parsed: ScanResult = JSON.parse(resultText.trim());
    
    return (parsed.contacts || []).map((c: any, i: number) => ({
      id: `contact-${Date.now()}-${i}`,
      name: String(c.name || '').trim(),
      title: String(c.title || '').trim(),
      company: String(c.company || '').trim(),
      email: String(c.email || '').trim(),
      phone: String(c.phone || '').trim(),
      website: String(c.website || '').trim(),
      address: String(c.address || '').trim(),
      linkedin: String(c.linkedin || '').trim(),
      notes: String(c.notes || '').trim(),
      isEdited: false
    }));
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    // Generic error messages are often better for users unless it's a specific API issue we can handle
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("System configuration error: Invalid API Key.");
    }
    throw new Error("Failed to analyze images. Please ensure the cards are well-lit and clearly visible.");
  }
};
