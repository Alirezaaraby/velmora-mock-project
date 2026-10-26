import React from 'react';
import { useApp } from '@/lib/AppContext';
import { FACTS } from '@/data/catalog';

export default function SiteFooter() {
  const { openStylist } = useApp();

  return (
    <footer className="border-t border-stone/70">
      <div className="mx-auto grid max-w-[120rem] gap-10 px-6 py-14 md:grid-cols-4 md:px-[4vw]">
        <div>
          <p className="font-heading text-lg tracking-[0.42em]">VELMORA</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/75">
            Evening wear, made to order in {FACTS.studio}. {FACTS.collectionSize} pieces.
          </p>
        </div>

        <div>
          <p className="eyebrow text-ink/70">Sizes</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">
            UK 6 to UK 18, in every piece. Sizes outside this range are non-standard and are made to
            order.
          </p>
        </div>

        <div>
          <p className="eyebrow text-ink/70">Shipping</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/80">
            <li>Made to order in 14 to 21 days.</li>
            <li>UK 3 to 5 days after making.</li>
            <li>EU 5 to 8 days after making.</li>
            <li>Pieces that ship from stock leave in 3 days.</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink/70">Returns</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">{FACTS.returnsNote}</p>
        </div>
      </div>

      <div className="border-t border-stone/70">
        <div className="mx-auto flex max-w-[120rem] flex-col gap-5 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-[4vw]">
          <div>
            <p className="eyebrow text-ink/70">Contact</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/80">
              Questions about fabric, fit or delivery dates: ask the stylist. Your answers stay on
              your device.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openStylist()}
            className="min-h-[48px] border border-oxblood px-6 text-xs uppercase tracking-[0.2em] text-oxblood transition-colors hover:bg-oxblood hover:text-ivory"
          >
            Ask the stylist
          </button>
        </div>
      </div>
    </footer>
  );
}