import { callStreamTextWithHistory } from "@/lib/ai";
import { CoreMessage } from "ai";

function isCoreMessageArray(data: any): data is CoreMessage[] {
  return (
    Array.isArray(data) &&
    data.every(
      (msg) =>
        typeof msg === "object" &&
        typeof msg.role === "string" &&
        typeof msg.content === "string"
    )
  );
}

export async function POST(request: Request) {
  const body = JSON.parse(await request.text());
  if (!isCoreMessageArray(body)) {
    return new Response("Invalid body: expected CoreMessage[]", { status: 400 });
  }
  const aiResponseStream = callStreamTextWithHistory(body);
  return new Response(aiResponseStream);
}