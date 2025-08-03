import { toolCalling } from "@/lib/ai";

export async function POST(request: Request) {
  const { messages } = await request.json();
	return toolCalling(messages);
}