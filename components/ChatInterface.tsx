// components/ChatInterface.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, StopCircle, Copy, Check, RotateCcw, Trash2, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import ModelSelector from './ModelSelector';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

// Auto‑scroll hook
function useAutoScroll(dependency: any) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    if (shouldScrollRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dependency]);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    shouldScrollRef.current = atBottom;
  }, []);

  return { bottomRef, onScroll };
}

export default function ChatInterface() {
  const [model, setModel] = useState('gemini-2.0-flash');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { bottomRef, onScroll } = useAutoScroll(messages);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsLoading(true);

    // Create abort controller for stopping
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        // Batch update every ~50ms for smooth UI
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsg.id
              ? { ...msg, content: buffer }
              : msg,
          ),
        );
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsg.id
              ? { ...msg, content: msg.content || '❌ Something went wrong.' }
              : msg,
          ),
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const clearChat = () => setMessages([]);

  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const regenerateLast = () => {
    // Remove last assistant message and re‑send the previous user message
    setMessages(prev => {
      const newMessages = [...prev];
      // Remove last assistant message
      if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
        newMessages.pop();
      }
      const lastUser = newMessages.length > 0 ? newMessages[newMessages.length - 1] : null;
      if (lastUser?.role === 'user') {
        setInput(lastUser.content);
        // Trigger send automatically? Better to let user click
      }
      return newMessages;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
          <span className="font-semibold text-lg text-zinc-800 dark:text-zinc-100">
            AI Studio
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ModelSelector selected={model} onSelect={setModel} />
          <button
            onClick={clearChat}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
            <Bot size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm mt-1">Select a model and type your first message.</p>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        return !isInline ? (
                          <div className="relative group my-2">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-t-lg">
                              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
                                {match[1]}
                              </span>
                              <button
                                onClick={() => copyMessage(String(children), msg.id + 'code')}
                                className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                              >
                                {copiedId === msg.id + 'code' ? (
                                  <Check size={14} />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                            <pre className="!mt-0 !rounded-t-none bg-zinc-900 dark:bg-black text-white p-4 overflow-x-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        ) : (
                          <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content || (isLoading && msg.id === messages[messages.length - 1]?.id ? 'Thinking...' : '')}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
              )}

              {/* Action buttons for assistant messages */}
              {msg.role === 'assistant' && msg.content && !isLoading && (
                <div className="mt-2 flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                  <button
                    onClick={() => copyMessage(msg.content, msg.id)}
                    className="hover:text-zinc-700 dark:hover:text-white transition-colors"
                  >
                    {copiedId === msg.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={regenerateLast}
                    className="hover:text-zinc-700 dark:hover:text-white transition-colors"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Invisible div for auto‑scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything..."
            className="flex-1 rounded-2xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-5 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          {isLoading ? (
            <button
              onClick={stopGeneration}
              className="rounded-2xl bg-red-500 hover:bg-red-600 text-white p-3 shadow-lg transition-all"
            >
              <StopCircle size={20} />
            </button>
          ) : (
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white p-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
