import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/AppContext';

export default function SiteHeader() {
  const { openStylist, setBagOpen, bagCount } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-stone/70 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-[120rem] items-center justify-between px-6 py-4 md:grid md:grid-cols-3 md:px-[4vw]">
        <div className="order-2 md:order-none md:justify-self-start">
          <button
            type="button"
            onClick={() => openStylist()}
            className="min-h-[44px] text-xs uppercase tracking-[0.2em] text-oxblood underline decoration-stone underline-offset-8 transition-colors hover:decoration-oxblood"
          >
            Stylist
          </button>
        </div>

        <Link
          href="/"
          className="order-1 md:order-none md:justify-self-center"
          aria-label="Velmora, home"
        >
          <span className="font-heading text-lg tracking-[0.42em] md:text-2xl">VELMORA</span>
        </Link>

        <div className="order-3 md:order-none md:justify-self-end">
          <button
            type="button"
            onClick={() => setBagOpen(true)}
            aria-label={bagCount ? `Bag, ${bagCount} pieces` : 'Bag, empty'}
            className="relative flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-oxblood"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 8h12l1 12H5L6 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            {bagCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-oxblood px-1 text-[10px] leading-none text-ivory">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}