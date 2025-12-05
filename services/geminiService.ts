import { GoogleGenAI, Type } from "@google/genai";
import { Article } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchGCCMedicalNews = async (): Promise<Article[]> => {
  const ai = getClient();
  
  // We use the search tool to find actual recent info
  const prompt = `
    Find the top 5 most significant medical and healthcare news stories from the GCC region (Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman) from the last 7 days.
    Focus on government initiatives, hospital openings, medical tech advancements, or public health updates.
    
    Return the result strictly as a JSON array of objects. 
    Each object must have:
    - title: string
    - summary: string (2-3 sentences)
    - source: string (name of publisher)
    - date: string (approximate date)
    - region: string (Specific country or "GCC")
    
    Ensure the JSON is valid and not wrapped in any explanation or markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    if (!text) return [];

    // FIX: Clean up markdown code fences (```json and ```) 
    // which often wrap JSON responses when not using structured output mode.
    if (text.startsWith('```json')) {
      text = text.substring('```json'.length);
    }
    if (text.endsWith('```')) {
      // Trim the trailing '```' and any surrounding whitespace
      text = text.substring(0, text.length - '```'.length).trim();
    }

    const rawArticles = JSON.parse(text);
    
    // Add IDs and map to the Article type.
    
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
    You are an expert social media strategist for the GCC healthcare sector.
    Write a high-engagement LinkedIn post based on the following article:
    
    Title: ${article.title}
    Summary: ${article.summary}
    Region: ${article.region}
    Source: ${article.source}
    
    STYLE GUIDELINES:
    1. Start with a "Hook" (a provocative question or strong statement).
    2. Add "The Insight" (why this matters for healthcare in the Middle East).
    3. Include bullet points for key details (use emojis like 🏥, 💉, 📈).
    4. End with a "Discussion Starter" question to drive comments.
    5. Tone: Professional, authoritative, yet accessible.
    6. Include 3-5 hashtags at the very bottom (e.g., #GCCHealth, #Vision2030, #HealthTech).
    
    Format the output with clean line breaks between sections. Do not use markdown bolding (asterisks), just plain text that looks good on LinkedIn.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Failed to generate post.";
  } catch (error) {
    console.error("Error generating post:", error);
    return "Error generating post content. Please try again.";
  }
};