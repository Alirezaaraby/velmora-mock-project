// Editorial photography from Unsplash, standing in for the collection shoot.
// Swap these URLs for the real photography when it is ready.

const unsplash = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PIECE_IMAGES = {
  isola: [
    unsplash('1469334031218-e382a71b716b'),
    unsplash('1619043518800-7f14be467dca'),
    unsplash('1623580674393-edf6eb7090f8'),
  ],
  aveline: [
    unsplash('1568252542512-9fe8fe9c87bb'),
    unsplash('1606259458027-54d2a728b6ab'),
    unsplash('1774009501393-bac5a0a11afc'),
  ],
  marchetti: [
    unsplash('1762430790606-bf626757a00b'),
    unsplash('1764437835706-ba9d63250bd2'),
    unsplash('1765229277457-dd2f9f259f17'),
  ],
  noor: [
    unsplash('1617258856138-402b60da4e2a'),
    unsplash('1764437835714-322ab28f0770'),
    unsplash('1490481651871-ab68de25d43d'),
  ],
  linden: [
    unsplash('1595777457583-95e0591f7c9f'),
    unsplash('1606259457945-67dc66271ee6'),
    unsplash('1763928801168-c4801758c5d0'),
  ],
  vesper: [
    unsplash('1765871421513-452fe03d15cc'),
    unsplash('1732869415090-179de017b6d6'),
    unsplash('1760893107461-baee57948240'),
  ],
};

const FALLBACK_IMAGES = Object.values(PIECE_IMAGES).map(([image]) => image);

const OCCASION_IMAGES = {
  'winter-wedding': unsplash('1774009501393-bac5a0a11afc'),
  'black-tie': unsplash('1762430790606-bf626757a00b'),
  'new-years-eve': unsplash('1765229277457-dd2f9f259f17'),
  'christmas-party': unsplash('1568251188392-ae32f898cb3b'),
};

const fallbackImagesFor = (slug) => {
  const hash = [...String(slug)].reduce((total, character) => total + character.charCodeAt(0), 0);
  const start = hash % FALLBACK_IMAGES.length;

  return Array.from({ length: 3 }, (_, index) => FALLBACK_IMAGES[(start + index) % FALLBACK_IMAGES.length]);
};

const imagesFor = (slug) => PIECE_IMAGES[slug] || fallbackImagesFor(slug);

export const pieceImage = (slug, view = 0) => imagesFor(slug)[view] || imagesFor(slug)[0];

export const pieceThumb = (slug, view = 0) =>
  pieceImage(slug, view).replace('w=900', 'w=300');

export const occasionImage = (id) => OCCASION_IMAGES[id];