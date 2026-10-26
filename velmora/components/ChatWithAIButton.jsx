'use client';

import React from 'react';
import { useApp } from '@/lib/AppContext';

export default function ChatWithAIButton() {
  const { openStylist } = useApp();

  return (
    <div className="chat-ai-orbit fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full p-[1.5px]">
      <button
        type="button"
        onClick={() => openStylist()}
        className="chat-ai-button group relative flex min-h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-white px-7 text-xs font-medium uppercase tracking-[0.2em] text-ink shadow-[0_12px_35px_rgb(30_27_26_/_14%)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="chat-ai-sparkle h-4 w-4 fill-oxblood"
        >
          <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 12l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" />
        </svg>
        <span className="relative z-10">Chat with AI</span>
        <span aria-hidden="true" className="chat-ai-shine" />
      </button>
    </div>
  );
}