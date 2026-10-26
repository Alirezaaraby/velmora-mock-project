import React from 'react';
import { cn } from '@/lib/utils';

const ITEMS = [
  'Made in London, 14 to 21 days',
  'UK 3 to 5 days, EU 5 to 8 days after making',
  'Returns within 14 days, unworn, with tags',
];

export default function DeliveryStrip() {
  return (
    <section aria-label="Delivery and returns" className="border-y border-stone/70">
      <ul className="mx-auto flex max-w-[120rem] snap-x snap-mandatory overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible">
        {ITEMS.map((item, index) => (
          <li
            key={item}
            className={cn(
              'eyebrow flex min-w-[84%] shrink-0 snap-start items-center px-6 py-5 text-ink/75 md:min-w-0 md:px-[4vw]',
              index > 0 && 'md:border-l md:border-stone/70',
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}