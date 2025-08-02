import {
  CoreMessage,
  generateObject,
  generateText,
  ImagePart,
  streamObject,
  streamText,
} from "ai";
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

export const recipeSchema = z.object({
  recipe: z.object({
    name: z.string().describe("The name of the recipe"),
    ingredients: z
      .array(
        z.object({
          name: z.string().describe("The name of the ingredient"),
          quantity: z.string().describe("The quantity of the ingredient"),
          unit: z
            .string()
            .describe("The unit of measurement for the ingredient"),
        })
      )
      .describe("The ingredients of the recipe"),
    steps: z.array(z.string()).describe("The steps to prepare the recipe"),
  }),
});

export function streamRecipe(prompt: string) {
  const { textStream } = streamObject({
    model,
    prompt,
    schema: recipeSchema,
    schemaName: "recipe",
    system: "You are a helpful assistant that generates recipes.",
  });

  return textStream;
}

export async function sentimentAnalysis(prompt: string) {
  const output = await generateObject({
    model,
    prompt,
    output: "enum",
    enum: ["positive", "negative", "neutral"],
  });

  return output;
}

export function describeImage(data: string) {
  const { textStream } = streamText({
    model,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that describes images. Please provide an answer no more than 2-3 sentences long.",
      },
      {
        role: "user",
        content: [
          {
            type: "image",
            image: data, // Assuming 'data' is a base64 encoded string of the image
          },
        ],
      },
    ],
  });

  return textStream;
}

export function queryPDF(prompt: string, attachment: string, attachmentName: string) {
  const { textStream } = streamText({
    model,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "file",
            data: attachment, // Assuming 'attachment' is a base64 encoded string of the image
            filename: "document.pdf",
            mimeType: "application/pdf",
          },
        ],
      },
    ],
  });

  return textStream;
}