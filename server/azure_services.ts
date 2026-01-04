import axios from "axios";
import { OpenAI } from "openai";

// Azure Computer Vision
const visionEndpoint = process.env.AZURE_VISION_ENDPOINT;
const visionKey = process.env.AZURE_VISION_KEY;

// Azure OpenAI
let openai: OpenAI | null = null;

if (process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
  openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
    defaultQuery: { "api-version": "2023-05-15" },
    defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY },
  });
}

export async function analyzeImageWithVision(imageUrl: string): Promise<string> {
  if (!visionEndpoint || !visionKey) {
    console.warn("Azure Vision credentials missing. Using placeholder.");
    return "A placeholder description of the image.";
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
      }
    );
    const caption = response.data.captionResult?.text || "No caption generated";
    const tags = response.data.tagsResult?.values.map((t: any) => t.name).join(", ");
    return `${caption}. Tags: ${tags}`;
  } catch (error) {
    console.error("Azure Vision Error:", error);
    return "Failed to analyze image.";
  }
}

export async function generateMemoryPrompt(tags: string[]): Promise<string> {
  if (!openai || !process.env.AZURE_OPENAI_KEY) {
    console.warn("Azure OpenAI credentials missing. Using placeholder.");
    return "Do you remember this moment?";
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant for dementia patients. Generate a simple, engaging question based on the image description to spark a memory." },
        { role: "user", content: `Generate a question for an image with these details: ${tags.join(", ")}` }
      ],
      model: "gpt-35-turbo", // or your deployment name
    });

    return completion.choices[0].message.content || "Do you remember this?";
  } catch (error) {
    console.error("Azure OpenAI Error:", error);
    return "Do you remember this?";
  }
}
