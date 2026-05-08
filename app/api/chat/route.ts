import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export const runtime = 'nodejs'; // Edge নয়, কারণ কিছু SDK Edge-এ চলে না

type ChatRole = 'user' | 'assistant' | 'system';

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const isChatMessage = (value: unknown): value is ChatMessage => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as { role?: unknown; content?: unknown };
  return (
    (candidate.role === 'user' || candidate.role === 'assistant' || candidate.role === 'system') &&
    typeof candidate.content === 'string'
  );
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { model?: unknown; messages?: unknown };
  const { model, messages } = body;

  if (typeof model !== 'string' || !Array.isArray(messages) || !messages.every(isChatMessage)) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (messages.length === 0) {
    return Response.json({ error: 'At least one message is required' }, { status: 400 });
  }

  try {
    if (model.startsWith('gemini')) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const geminiModel = genAI.getGenerativeModel({ model });
      const chat = geminiModel.startChat({
        history: messages.slice(0, -1).map((m: ChatMessage) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      });
      const result = await chat.sendMessageStream(messages[messages.length - 1].content);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    if (model.startsWith('claude')) {
      const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY! });
      const stream = await anthropic.messages.create({
        model,
        messages: messages.map((m: ChatMessage) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        max_tokens: 1024,
        stream: true,
      });
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && 'text' in event.delta) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        },
      });
      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    if (model.startsWith('deepseek')) {
      const deepseek = new OpenAI({
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: process.env.DEEPSEEK_API_KEY!,
      });
      const completion = await deepseek.chat.completions.create({
        model,
        messages,
        stream: true,
      });
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    return Response.json({ error: 'Unsupported model' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return Response.json({ error: message }, { status: 500 });
  }
}
