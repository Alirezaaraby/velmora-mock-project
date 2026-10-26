import React from 'react';
import Drawer from '@/components/Drawer';
import { STATUS } from '@/data/catalog';
import { useApp } from '@/lib/AppContext';
import { cn } from '@/lib/utils';

export default function BagPanel() {
  const { bagOpen, setBagOpen, bag, removeFromBag, bagTotal } = useApp();

  return (
    <Drawer
      open={bagOpen}
      onClose={() => setBagOpen(false)}
      title="Bag"
      label="Bag"
      subtitle="Velmora"
      footer={
        bag.length ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="eyebrow text-ink/70">Subtotal</span>
              <span>£{bagTotal}</span>
            </div>
            <p className="text-xs leading-relaxed text-ink/70">
              Made-to-order pieces are made after you order them. Checkout opens when the label
              launches.
            </p>
          </div>
        ) : null
      }
    >
      {bag.length === 0 ? (
        <p className="px-6 py-8 text-sm leading-relaxed text-ink/75">
          Nothing in the bag yet. Choose a piece and a size to add it.
        </p>
      ) : (
        <ul className="divide-y divide-stone/70">
          {bag.map((item) => (
            <li key={item.id} className="flex gap-4 px-6 py-5">
              <div className="flex-1">
                <p className="font-heading text-lg font-light">{item.name}</p>
                <p className="mt-1 text-sm text-ink/75">
                  {item.colour}, {item.size}
                </p>
                <p className="eyebrow mt-2 text-ink/70">{STATUS[item.status]?.label}</p>
                <p className="mt-2 text-sm">£{item.price}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFromBag(item.id)}
                className={cn(
                  'h-11 shrink-0 self-start px-2 text-xs uppercase tracking-[0.18em] text-ink/70',
                  'underline decoration-stone underline-offset-4 transition-colors hover:text-oxblood',
                )}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}