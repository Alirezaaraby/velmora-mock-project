import React from 'react';
import PlaceholderImage from '@/components/PlaceholderImage';
import { pieceImage, pieceThumb } from '@/data/images';
import { cn } from '@/lib/utils';

export const VIEWS = ['Front', 'Detail', 'Back'];

export default function ProductGallery({ slug, view, onView }) {
  return (
    <div>
      <PlaceholderImage
        image={pieceImage(slug, view)}
        label={VIEWS[view]}
        className="border border-stone/70"
      />
      <div className="mt-3 grid grid-cols-3 gap-3">
        {VIEWS.map((name, index) => (
          <button
            key={name}
            type="button"
            onClick={() => onView(index)}
            aria-pressed={index === view}
            aria-label={`Show ${name}`}
            className={cn(
              'block border transition-colors',
              index === view ? 'border-oxblood' : 'border-stone/70 hover:border-ink',
            )}
          >
            <PlaceholderImage image={pieceThumb(slug, index)} ratio="1 / 1" label={name} />
          </button>
        ))}
      </div>
    </div>
  );
}