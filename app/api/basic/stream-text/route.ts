import { callStreamText } from "@/lib/ai";

export async function POST(request: Request) {
  const userMessage = await request.text();
  if (!userMessage || userMessage.trim() === "") {
    return new Response("No body provided", { status: 400 });
  }
  const aiResponseStream = callStreamText(userMessage);
  return new Response(aiResponseStream);
}