import axios from "axios";
import { OpenAI } from "openai";

// Azure Computer Vision (F0 Tier Logic)
const visionEndpoint = process.env.AZURE_VISION_ENDPOINT;
const visionKey = process.env.AZURE_VISION_KEY;

// Azure OpenAI (Cost-effective Tier)
let openai: OpenAI | null = null;

if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
  openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-35-turbo'}`,
    defaultQuery: { "api-version": "2023-05-15" },
    defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY },
  });
}

export async function analyzeImageWithVision(imageUrl: string): Promise<string> {
  if (!visionEndpoint || !visionKey) {
    return "A beautiful memory to cherish.";
  }

  try {
    const response = await axios.post(
      `${visionEndpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=caption,tags`,
      { url: imageUrl },
      {
        headers: {
          "Ocp-Apim-Subscription-Key": visionKey,
          "Content-Type": "application/json",
        },
        timeout: 5000, // 5s timeout for stability
      }
    );
    const caption = response.data.captionResult?.text;
    const tags = response.data.tagsResult?.values?.slice(0, 5).map((t: any) => t.name).join(", ");
    
    if (!caption && !tags) return "A special moment together.";
    return `${caption || 'Image'}${tags ? ' showing ' + tags : ''}`;
  } catch (error) {
    console.error("Azure Vision Error:", error);
    return "A special moment captured in time."; // Simplified view fallback
  }
}

export async function generateMemoryPrompt(description: string): Promise<string> {
  if (!openai) {
    return "Do you remember this happy moment?";
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a gentle assistant for dementia patients. Based on the photo description, generate one short, simple, memory-sparking question (max 10 words). Avoid complex language." 
        },
        { role: "user", content: `Photo description: ${description}` }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 50,
      temperature: 0.7,
    });

    return completion.choices[0].message.content?.trim() || "Does this bring back any happy memories?";
  } catch (error) {
    console.error("Azure OpenAI Error:", error);
    return "Do you remember this wonderful time?"; // Simplified view fallback
  }
}
