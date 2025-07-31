import { generateTextCall } from "@/lib/ai";

export async function POST(request: Request) {
  if (!request.body) {
    return new Response("No body provided", {
      status: 400,
    });
  }
  const reader = request.body.getReader();
  let userMessage = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    userMessage += new TextDecoder().decode(value);
  }
	console.log(userMessage)
  if (userMessage == "") {
    return new Response("No body provided", {
      status: 400,
    });
  }
  const aiResponse = await generateTextCall(userMessage);
  return new Response(aiResponse);
}
