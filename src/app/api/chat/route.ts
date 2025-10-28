export const runtime = "nodejs";

import { getOllamaClient } from "@/lib/ai/ollama";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const ollama = getOllamaClient();

  const response = await ollama.chat({
    model: "gpt-oss:120b-cloud",
    messages,
    stream: true,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const part of response) {
        controller.enqueue(encoder.encode(part.message.content));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}