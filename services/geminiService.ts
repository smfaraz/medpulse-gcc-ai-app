import { GoogleGenAI } from "@google/genai";
import { Article } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchGCCIndustryNews = async (): Promise<Article[]> => {
  const ai = getClient();
  
  const prompt = `
    Find the top 6 most significant news stories from the GCC (Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman) 
    from the last 7 days focusing on these three specific sectors:
    1. IT (AI, cybersecurity, digital infrastructure).
    2. Oil & Gas (Energy transition, hydrogen, market updates).
    3. Saudi Vision 2030 (Major giga-projects like NEOM, social reforms, or economic diversification updates).
    
    Return the result strictly as a JSON array of objects. 
    Each object MUST have:
    - title: string
    - summary: string (2-3 sentences)
    - source: string
    - date: string
    - region: string
    - sector: string (Must be exactly "IT", "Oil & Gas", or "Vision 2030")
    
    Ensure the JSON is valid and not wrapped in markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });

    let text = response.text || "";
    text = text.replace(/```json|```/g, "").trim();
    const rawArticles = JSON.parse(text);
    
    return rawArticles.map((art: any, index: number) => ({
      ...art,
      id: `art-${Date.now()}-${index}`,
      url: ''
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const generateLinkedInPost = async (article: Article): Promise<string> => {
  const ai = getClient();
  const prompt = `
    You are a premier business consultant for the GCC region.
    Write a high-engagement LinkedIn post based on this article:
    
    Title: ${article.title}
    Sector: ${article.sector}
    Region: ${article.region}
    
    STYLE GUIDELINES:
    1. Start with a powerful hook about GCC growth.
    2. Explain the strategic importance of this update.
    3. Use sector-relevant emojis (💻 for IT, 🛢️ for Energy, 🇸🇦 for Vision 2030).
    4. End with a question to drive engagement.
    5. Include 4 relevant hashtags.
    
    Plain text only, no markdown bolding.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Failed to generate post.";
  } catch (error) {
    return "Error generating post content.";
  }
};