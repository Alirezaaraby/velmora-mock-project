import React from 'react';
import PlaceholderImage from '@/components/PlaceholderImage';
// import { pieceImage, pieceThumb } from '@/data/images';
import { cn } from '@/lib/utils';

export const VIEWS = ['Front', 'Detail', 'Back'];

export default function ProductGallery({ image, images = [], view, onView }) {
  const galleryImages = images.length ? images : [image].filter(Boolean);
  const activeImage = galleryImages[view] || galleryImages[0] || image;

  return (
    <div>
      <PlaceholderImage
        image={activeImage}
        label={VIEWS[view]}
        className="border border-stone/70"
      />
      <div className="mt-3 grid grid-cols-3 gap-3">
        {galleryImages.map((href, index) => (
          <button
            key={`${href}-${index}`}
            type="button"
            onClick={() => onView(index)}
            aria-pressed={index === view}
            aria-label={`Show ${VIEWS[index] || `image ${index + 1}`}`}
            className={cn(
              'block border transition-colors',
              index === view ? 'border-oxblood' : 'border-stone/70 hover:border-ink',
            )}
          >
            <PlaceholderImage image={href} ratio="1 / 1" label={VIEWS[index]} />
          </button>
        ))}
      </div>
    </div>
  );
}