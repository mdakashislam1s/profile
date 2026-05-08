import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { model, messages } = req.body;

  // সার্ভার-সেন্ট ইভেন্ট বা চাংকড ট্রান্সফার এনকোডিংয়ের জন্য হেডার সেট
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
    if (model.startsWith('gemini')) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({ model });
      const chat = geminiModel.startChat({
        history: messages.slice(0, -1).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      });
      const result = await chat.sendMessageStream(messages[messages.length - 1].content);
      for await (const chunk of result.stream) {
        const text = chunk.text();
        res.write(text);
        // ফ্লাশ করে পাঠাতে, যেন ক্লায়েন্ট সাথে সাথে পায়
        if (typeof res.flushHeaders === 'function') res.flushHeaders();
      }
    } else if (model.startsWith('claude')) {
      const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
      const stream = await anthropic.messages.create({
        model,
        messages: messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        max_tokens: 1024,
        stream: true,
      });
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta?.text) {
          res.write(event.delta.text);
          if (typeof res.flushHeaders === 'function') res.flushHeaders();
        }
      }
    } else if (model.startsWith('deepseek')) {
      const deepseek = new OpenAI({
        baseURL: 'https://api.deepseek.com/v1',
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
      const completion = await deepseek.chat.completions.create({
        model,
        messages,
        stream: true,
      });
      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          res.write(text);
          if (typeof res.flushHeaders === 'function') res.flushHeaders();
        }
      }
    } else {
      res.status(400).json({ error: 'Unsupported model' });
      return;
    }
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).end('Error occurred');
  }
}
