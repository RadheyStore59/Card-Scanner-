
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, ScanResult } from "../types";

export const extractBusinessCards = async (base64Images: string[]): Promise<Contact[]> => {
  // Check for API Key presence
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "YOUR_API_KEY") {
    throw new Error("API Key is missing. Please check your deployment environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  // Using gemini-2.5-flash as requested by the PRD
  const model = 'gemini-2.5-flash';
  
  const imageParts = base64Images.map((img, index) => {
    const base64Data = img.split(',')[1] || img;
    const mimeMatch = img.match(/^data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    
    return {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };
  });

  const prompt = `Act as a high-precision OCR and contact extraction engine. 
  Extract structured contact data from the provided business card image(s).
  Return a JSON object with a "contacts" array.
  
  For each person, extract:
  - name (Full Name)
  - title (Job Title)
  - company (Company Name)
  - email (Professional email)
  - phone (Phone number)
  - website (URL)
  - address (Physical address)
  - linkedin (LinkedIn URL)
  - notes (Any other info)

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
      }
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsed: ScanResult = JSON.parse(response.text.trim());
    
    return (parsed.contacts || []).map((c: any, i: number) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
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
    console.error("Gemini Error:", error);
    // Provide more context in the error message for mobile debugging
    let detailedMsg = error.message || "Unknown API Error";
    if (detailedMsg.includes("403")) detailedMsg = "Access Denied (403). Check your API Key.";
    if (detailedMsg.includes("400")) detailedMsg = "Bad Request (400). Payload might be too large.";
    if (detailedMsg.includes("429")) detailedMsg = "Rate Limit Exceeded (429). Slow down.";
    
    throw new Error(detailedMsg);
  }
};
