import { CoreMessage, generateText, streamObject, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";

const googleAISDKProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = googleAISDKProvider("gemini-2.0-flash");

export async function callGenerateText(prompt: string) {
  const { text } = await generateText({
    model: model,
    prompt: prompt,
  });
  return text;
}

export function callStreamText(prompt: string) {
  const { textStream } = streamText({
    model: model,
    prompt: prompt,
  });

  return textStream;
}

export function callStreamTextWithHistory(messages: CoreMessage[]) {
  const { textStream } = streamText({
    model: model,
    messages: messages,
  });

  return textStream;
}

export function callStreamTextWithSystemPrompt(
  prompt: string,
  systemPrompt: string
) {
  const { textStream } = streamText({
    model: model,
    prompt: prompt,
    system: systemPrompt,
  });
  return textStream;
}