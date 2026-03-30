"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AssistantWidgetProps = {
  onClose: () => void;
};

const HISTORY_KEY = "assistant_history_v1";

const STARTER: Message = {
  id: "starter",
  role: "assistant",
  content:
    "Hi, I am your intelligent website assistant. Ask me anything about SEO, performance, web strategy, or conversion and I will guide you clearly.",
};

export function AssistantWidget({ onClose }: AssistantWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([STARTER]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const rawHistory = window.localStorage.getItem(HISTORY_KEY);
    if (rawHistory) {
      try {
        const parsed = JSON.parse(rawHistory) as Message[];
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed.slice(-24));
        }
      } catch {
        window.localStorage.removeItem(HISTORY_KEY);
      }
    }

  }, []);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-24)));
  }, [messages]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isLoading]);

  const submitMessage = async (raw: string) => {
    const text = raw.trim();
    if (!text || isLoading) return;

    setError("");

    const userMessage: Message = {
      id: `${Date.now()}-u`,
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((item) => ({ role: item.role, content: item.content })),
        }),
        signal: controller.signal,
      });

      const data = (await response.json()) as { reply?: string; error?: string; details?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.details || data.error || "Assistant request failed");
      }

      const assistantMessage: Message = {
        id: `${Date.now()}-a`,
        role: "assistant",
        content: data.reply,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      if (message.toLowerCase().includes("abort")) {
        setError("Response stopped");
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
  };

  const clearChat = () => {
    setMessages([STARTER]);
    setError("");
    window.localStorage.removeItem(HISTORY_KEY);
  };

  return (
    <div className="assistant-panel w-[min(92vw,24rem)] rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold-300">Assistant</p>
          <p className="text-sm font-semibold text-zinc-100">Your intelligent partner</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={clearChat}
            className="rounded-md border border-white/15 px-2 py-1 text-[11px] text-zinc-300 transition-colors hover:border-gold-300/40 hover:text-gold-200"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 px-2 py-1 text-[11px] text-zinc-300 transition-colors hover:border-gold-300/40 hover:text-gold-200"
            aria-label="Close assistant"
          >
            Close
          </button>
        </div>
      </div>

      <div ref={listRef} className="max-h-[22rem] min-h-[18rem] space-y-2 overflow-y-auto px-3 py-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
              message.role === "user"
                ? "ml-5 border border-gold-300/30 bg-gold-500/10 text-zinc-100"
                : "mr-5 border border-white/10 bg-white/5 text-zinc-200"
            }`}
          >
            {message.content}
          </div>
        ))}

        {isLoading ? (
          <div className="mr-5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
            Thinking...
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10 px-3 py-2.5">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submitMessage(input);
            }
          }}
          placeholder="Ask anything about SEO, performance, and growth..."
          className="h-20 w-full resize-none rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-gold-300/45"
        />

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="truncate text-[11px] text-zinc-400">{error || "Press Enter to send, Shift+Enter for new line"}</p>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <button
                type="button"
                onClick={stopGeneration}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:border-gold-300/40 hover:text-gold-200"
              >
                Stop
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => void submitMessage(input)}
              disabled={isLoading || !input.trim()}
              className="rounded-lg border border-gold-300/45 bg-gold-500/90 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
