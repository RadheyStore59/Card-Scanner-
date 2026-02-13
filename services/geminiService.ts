
import { GoogleGenAI, Type } from "@google/genai";
import { Contact } from "../types";

/**
 * Extracts business card data from a set of base64 image strings using Gemini 3 Flash.
 */
export const extractBusinessCards = async (base64Images: string[]): Promise<Contact[]> => {
  // Initialize AI client using the environment variable directly.
  // The SDK expects the key to be provided in this format as a named parameter.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
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

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("No text content returned from the model.");
    }

    const result = JSON.parse(jsonStr.trim());
    
    const contacts: Contact[] = (result.contacts || []).map((c: any) => ({
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      name: c.name || '',
      title: c.title || '',
      company: c.company || '',
      email: c.email || '',
      phone: c.phone || '',
      website: c.website || '',
      address: c.address || '',
      linkedin: c.linkedin || '',
      notes: c.notes || '',
      isEdited: false
    }));

    return contacts;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Include the error message in the re-thrown error for better debugging in the UI
    throw new Error(error.message || "An unknown error occurred during extraction.");
  }
};
