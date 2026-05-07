// app/ai/page.tsx
import ChatInterface from '@/components/ChatInterface';

export const metadata = {
  title: 'AI Chat – Akash',
  description: 'Chat with Gemini, Claude, and DeepSeek.',
};

export default function AiPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <ChatInterface />
    </main>
  );
}
