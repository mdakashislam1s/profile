import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export const runtime = 'nodejs'; // Edge নয়, কারণ কিছু SDK Edge-এ চলে না

export async function POST(req: NextRequest) {
  const { model, messages } = await req.json();

  try {
    if (model.startsWith('gemini')) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const geminiModel = genAI.getGenerativeModel({ model });
      const chat = geminiModel.startChat({
        history: messages.slice(0, -1).map((m: any) => ({
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
        messages: messages.map((m: any) => ({
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
  } catch (error: any) {
    return Response.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
