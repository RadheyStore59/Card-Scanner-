
import { GoogleGenAI, Type } from "@google/genai";
import { Contact } from "../types";

// Extracts business card data from a set of base64 image strings using Gemini 3 Pro.
export const extractBusinessCards = async (base64Images: string[]): Promise<Contact[]> => {
  // Directly initialize using the injected environment variable as per guidelines
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing from the execution context.");
  }

  const ai = new GoogleGenAI({ apiKey });
  // Using gemini-3-pro-preview for high accuracy extraction of structured data from images
  const model = 'gemini-3-pro-preview';
  
  const imageParts = base64Images.map((img) => {
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

  const prompt = `Extract all contact information from these business card images. 
Analyze the visual details carefully. Return a JSON object with a "contacts" array.
For each person found, include:
- name (Full Name)
- title (Job Position)
- company (Company)
- email (Email)
- phone (Phone)
- website (URL)
- address (Address)
- linkedin (LinkedIn)
- notes (Extra info like slogans or certifications)

Return ONLY valid JSON. Use empty strings for missing fields.`;

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
      },
    });

    // Extract text from the response using the .text property
    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("No response text from Gemini API");
    }

    // Parse the JSON output to extract contact list
    const result = JSON.parse(jsonStr.trim());
    
    // Map data to local Contact type and ensure unique IDs
    const contacts: Contact[] = (result.contacts || []).map((c: any) => ({
      ...c,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      isEdited: false
    }));

    return contacts;
  } catch (error) {
    console.error("Gemini API Error during extraction:", error);
    throw error;
  }
};
