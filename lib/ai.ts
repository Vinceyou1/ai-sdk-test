import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const googleAISDKProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = googleAISDKProvider("gemini-2.0-flash");

export async function generateTextCall(prompt: string) {
  console.log(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
  const { text } = await generateText({
    model: model,
    prompt: prompt,
  });
  return text;
}
