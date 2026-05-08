import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, StopCircle, Copy, Check, RotateCcw, Trash2, ChevronDown, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// ---------- মডেল সিলেক্টর (ইনলাইন) ----------
const models = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', gradient: 'from-blue-600 to-violet-600' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', gradient: 'from-orange-500 to-red-500' },
  { id: 'deepseek-chat', name: 'DeepSeek‑V3', provider: 'DeepSeek', gradient: 'from-emerald-500 to-teal-600' },
];

function ModelSelector({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = models.find(m => m.id === selected) || models[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button onClick={() => setOpen(!open)} className="group flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-2.5 shadow-sm hover:shadow-md transition-all">
        <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${current.gradient}`} />
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{current.name}</span>
        <ChevronDown size={18} className={`text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 w-72 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 shadow-2xl z-50">
          {models.map(model => (
            <button key={model.id} onClick={() => { onSelect(model.id); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${selected === model.id ? 'bg-zinc-100 dark:bg-zinc-800 shadow-inner' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
              <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${model.gradient} ring-2 ring-white dark:ring-zinc-900`} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{model.name}</span>
                <span className="text-xs text-zinc-500">{model.provider}</span>
              </div>
              {selected === model.id && <Sparkles size={16} className="ml-auto text-zinc-600 dark:text-zinc-300" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- মূল পেজ ----------
export default function AiPage() {
  const [model, setModel] = useState('gemini-2.0-flash');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const abortRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldScrollRef = useRef(true);

  // অটো-স্ক্রল
  useEffect(() => {
    if (shouldScrollRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const onScroll = useCallback((e) => {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    shouldScrollRef.current = atBottom;
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const stopGeneration = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { id: crypto.randomUUID(), role: 'user', content: input.trim() };
    const assistantMsg = { id: crypto.randomUUID(), role: 'assistant', content: '' };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

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

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(msg => msg.id === assistantMsg.id ? { ...msg, content: buffer } : msg));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => prev.map(msg => msg.id === assistantMsg.id ? { ...msg, content: msg.content || '❌ কিছু সমস্যা হয়েছে।' } : msg));
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const clearChat = () => setMessages([]);
  const copyMessage = async (content, id) => { await navigator.clipboard.writeText(content); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };

  const regenerateLast = () => {
    setMessages(prev => {
      const copy = [...prev];
      if (copy.length > 0 && copy[copy.length - 1].role === 'assistant') copy.pop();
      const lastUser = copy.length > 0 ? copy[copy.length - 1] : null;
      if (lastUser?.role === 'user') setInput(lastUser.content);
      return copy;
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* হেডার */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <span className="font-semibold text-lg">AI Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <ModelSelector selected={model} onSelect={setModel} />
          <button onClick={clearChat} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><Trash2 size={18} /></button>
        </div>
      </div>

      {/* মেসেজ এরিয়া */}
      <div onScroll={onScroll} className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
            <Bot size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">কথা শুরু করুন</p>
            <p className="text-sm mt-1">একটি মডেল সিলেক্ট করুন ও আপনার প্রথম মেসেজ লিখুন।</p>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'}`}>
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
                              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300">{match[1]}</span>
                              <button onClick={() => copyMessage(String(children), msg.id + 'code')} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white">
                                {copiedId === msg.id + 'code' ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            </div>
                            <pre className="!mt-0 !rounded-t-none bg-zinc-900 dark:bg-black text-white p-4 overflow-x-auto">
                              <code className={className} {...props}>{children}</code>
                            </pre>
                          </div>
                        ) : (
                          <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>
                        );
                      }
                    }}
                  >
                    {msg.content || (isLoading && msg.id === messages[messages.length - 1]?.id ? 'চিন্তা করছে...' : '')}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
              )}

              {msg.role === 'assistant' && msg.content && !isLoading && (
                <div className="mt-2 flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                  <button onClick={() => copyMessage(msg.content, msg.id)} className="hover:text-zinc-700 dark:hover:text-white"><Copied id={copiedId} current={msg.id} /></button>
                  <button onClick={regenerateLast} className="hover:text-zinc-700 dark:hover:text-white"><RotateCcw size={16} /></button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ইনপুট বার */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="যেকোনো প্রশ্ন করুন..."
            className="flex-1 rounded-2xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-5 py-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
          />
          {isLoading ? (
            <button onClick={stopGeneration} className="rounded-2xl bg-red-500 hover:bg-red-600 text-white p-3 shadow-lg"><StopCircle size={20} /></button>
          ) : (
            <button onClick={sendMessage} disabled={!input.trim()} className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white p-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"><Send size={20} /></button>
          )}
        </div>
      </div>
    </div>
  );
}

// ছোট কপি চেক কম্পোনেন্ট
function Copied({ id, current }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(current); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return copied ? <Check size={16} /> : <Copy size={16} onClick={handleCopy} />;
}
