import React from 'react';
import Link from 'next/link';
import PlaceholderImage from '@/components/PlaceholderImage';

function formatOccasionName(name = '') {
  return name.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/'S\b/g, "'s");
}

export default function OccasionCard({ occasion }) {
  const title = formatOccasionName(occasion.name);

  return (
    <Link
      href={`/occasion/${occasion.id}`}
      aria-label={`${title}. Find a piece for this occasion.`}
      className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oxblood"
    >
      <PlaceholderImage
        image={occasion.image}
        className="transition-opacity duration-300 group-hover:opacity-90"
      />
      <h3 className="mt-4 font-heading text-2xl font-light text-ink md:text-3xl">
        {title}
      </h3>
      {/* <span className="mt-1 block text-sm text-ink/70 transition-colors group-hover:text-oxblood"> */}
        
      {/* </span> */}
    </Link>
  );
}