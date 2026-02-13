
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, ScanResult } from "../types";

export const extractBusinessCards = async (base64Images: string[]): Promise<Contact[]> => {
  // Directly initialize using the injected environment variable
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

Return ONLY valid JSON. Use "" for missing fields.`;

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
    if (!resultText) throw new Error("Empty AI response.");

    const parsed: ScanResult = JSON.parse(resultText.trim());
    
    return (parsed.contacts || []).map((c: any, i: number) => ({
      id: `contact-${Date.now()}-${i}`,
      name: String(c.name || '').trim() || 'Unknown',
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
    throw new Error(error.message || "Failed to analyze images. Try a clearer photo.");
  }
};
