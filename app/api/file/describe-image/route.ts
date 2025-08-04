import { describeImage } from "@/lib/ai";

export async function POST(request: Request) {
  const body = await request.text();
  const aiResponseStream = describeImage(body);
  return new Response(aiResponseStream);
}