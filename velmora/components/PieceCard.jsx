import React from 'react';
import Link from 'next/link';
import PlaceholderImage from '@/components/PlaceholderImage';
import { STATUS } from '@/data/catalog';
import { cn } from '@/lib/utils';

export default function PieceCard({ piece, compact = false, className = '' }) {
  return (
    <Link
      href={`/product/${piece.slug}`}
      className={cn('group block', className)}
      aria-label={`${piece.name}, £${piece.price}, ${STATUS[piece.status].label}`}
    >
      <PlaceholderImage
        image={piece.image}
        swatch={piece.colours[0].hex}
        label={compact ? undefined : piece.name}
        className="transition-opacity group-hover:opacity-90"
      />
      <div className={cn('mt-3', compact && 'mt-2')}>
        <h3 className={cn('font-heading font-light', compact ? 'text-base' : 'text-lg md:text-xl')}>
          {piece.name}
        </h3>
        <p className="mt-1 text-sm text-ink/75">
          {piece.fabric}, {piece.fit}
        </p>
        <p className="mt-1 text-sm">£{piece.price}</p>
        {!compact && <p className="eyebrow mt-2 text-ink/70">{STATUS[piece.status].label}</p>}
      </div>
    </Link>
  );
}