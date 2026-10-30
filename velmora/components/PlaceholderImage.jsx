import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function PlaceholderImage({ label, swatch, image, ratio = '4 / 5', caption = '', align = 'bottom', className }) {
  return (
    <div className={cn('relative w-full overflow-hidden bg-stone', className)} style={{ aspectRatio: ratio }}>
      {image && (
        <Image
          src={image}
          alt={label || ''}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {!image && swatch && (
        <span
          className="absolute left-4 top-4 h-6 w-6 border border-ink/20"
          style={{ backgroundColor: swatch }}
          aria-hidden="true"
        />
      )}
      <div className={cn('absolute inset-x-4', align === 'top' ? 'top-4' : 'bottom-4')}>
        {label && <span className="eyebrow block text-ink/80">{label}</span>}
        <span className="mt-1 block text-xs text-ink/70">{caption}</span>
      </div>
    </div>
  );
}