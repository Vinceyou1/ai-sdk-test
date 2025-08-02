import { queryPDF } from "@/lib/ai";

export async function POST(request: Request) {
	const body = JSON.parse(await request.text());
  if (
    !["prompt", "attachment", "attachmentName"].every((key) => {
      return Object.keys(body).includes(key) && typeof body[key] === "string";
    })
  ) {
    return new Response("Invalid body: expected prompt, attachment, and attachmentName", {
      status: 400,
    });
  }
	const aiResponseStream = queryPDF(body.prompt, body.attachment, body.attachmentName);
	return new Response(aiResponseStream);
}