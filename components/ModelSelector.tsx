// components/ModelSelector.tsx
'use client';

import { ChevronDown, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const models = [
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    gradient: 'from-blue-600 to-violet-600',
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek‑V3',
    provider: 'DeepSeek',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

interface Props {
  selected: string;
  onSelect: (model: string) => void;
}

export default function ModelSelector({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = models.find(m => m.id === selected) ?? models[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${current.gradient}`} />
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {current.name}
        </span>
        <ChevronDown
          size={18}
          className={`text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-72 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => {
                onSelect(model.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                selected === model.id
                  ? 'bg-zinc-100 dark:bg-zinc-800 shadow-inner'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <div
                className={`h-3 w-3 rounded-full bg-gradient-to-r ${model.gradient} ring-2 ring-white dark:ring-zinc-900`}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  {model.name}
                </span>
                <span className="text-xs text-zinc-500">{model.provider}</span>
              </div>
              {selected === model.id && (
                <Sparkles size={16} className="ml-auto text-zinc-600 dark:text-zinc-300" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
