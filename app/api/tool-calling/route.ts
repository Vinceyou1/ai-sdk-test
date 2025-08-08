import { toolCalling } from "@/lib/ai";
import { UIMessage } from "ai";

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
	return toolCalling(messages);
}