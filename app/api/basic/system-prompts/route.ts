import { callStreamTextWithSystemPrompt } from "@/lib/ai";

export async function POST(request: Request) {
  const body = JSON.parse(await request.text());
  if (
    !["prompt", "systemPrompt"].every((key) => {
      return Object.keys(body).includes(key) && typeof body[key] === "string";
    })
  ) {
    return new Response("Invalid body: expected prompt and systemPrompt", {
      status: 400,
    });
  }
  const aiResponseStream = callStreamTextWithSystemPrompt(body.prompt, body.systemPrompt);
  return new Response(aiResponseStream);
}
