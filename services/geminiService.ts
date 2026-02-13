
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, ScanResult } from "../types";

export const extractBusinessCards = async (base64Images: string[]): Promise<Contact[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const imageParts = base64Images.map(img => ({
    inlineData: {
      data: img.split(',')[1] || img,
      mimeType: 'image/jpeg'
    }
  }));

  const prompt = `Analyze the provided image(s) of business cards and extract structured contact data. 
  Each image may contain multiple cards. For every distinct person found, extract:
  - name (full name)
  - title (job title)
  - company (organization name)
  - email (professional email)
  - phone (phone number)
  - website (URL)
  - address (physical office/mailing address)
  - linkedin (profile link or username)
  - notes (any extra info like certifications or taglines)

  Return a JSON object with a "contacts" array. Ensure EVERY field is a string. If a piece of information is not found, use an empty string.`;

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

    const resultText = response.text || '{"contacts": []}';
    const parsed: ScanResult = JSON.parse(resultText);
    
    return (parsed.contacts || []).map((c: any) => ({
      id: crypto.randomUUID(),
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
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};
