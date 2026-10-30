// Velmora — sample catalogue for the design prototype.
// The Isola dress values come from the brief. The other pieces are sample
// entries so the grid and the stylist can be seen with real content; swap
// them for the real collection when it is ready.

export const FACTS = {
  // makingDays: [14, 21],
  // stockDays: 3,
  // shipping: { UK: [3, 5], EU: [5, 8] },
  // sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18'],
  // collectionSize: 48,
  returnsNote:
    'Returns within 14 days, unworn, with tags. Made-to-order pieces in a non-standard size cannot be returned.',
  returnsShort: 'Returns within 14 days, unworn, with tags.',
  studio: 'London',
};

export const STATUS = {
  in_stock: {
    label: 'In stock, ships in 3 days',
    short: 'Ships from stock',
  },
  made_to_order: {
    label: 'Made to order, 14 to 21 days',
    short: 'Made to order',
  },
};

// export const OCCASIONS = [
//   { id: 'winter-wedding', name: 'Winter wedding', count: 12, note: 'Long sleeves. Heavier silk.' },
//   { id: 'black-tie', name: 'Black tie', count: 9, note: 'Floor length. Quiet colour.' },
//   { id: 'new-years-eve', name: "New Year's Eve", count: 11, note: 'Bias cut. Satin.' },
//   { id: 'christmas-party', name: 'Christmas party', count: 16, note: 'Shorter length. Velvet.' },
// ];

// export const PIECES = [
//   {
//     slug: 'isola',
//     name: 'Isola dress',
//     price: 310,
//     fabric: 'jersey',
//     fit: 'column',
//     status: 'made_to_order',
//     colours: [
//       { name: 'champagne', hex: '#D8C7A9' },
//       { name: 'emerald', hex: '#255045' },
//     ],
//     sizes: FACTS.sizes,
//     occasions: ['winter-wedding', 'black-tie'],
//     detail: 'Cut close, with a high round neck and a closed back.',
//   },
//   {
//     slug: 'aveline',
//     name: 'Aveline dress',
//     price: 420,
//     fabric: 'silk',
//     fit: 'column',
//     status: 'made_to_order',
//     colours: [
//       { name: 'ivory', hex: '#F1EAE0' },
//       { name: 'oxblood', hex: '#6B1F2A' },
//     ],
//     sizes: FACTS.sizes,
//     occasions: ['black-tie', 'new-years-eve'],
//     detail: 'A single panel of silk, seam at the centre back.',
//   },
//   {
//     slug: 'marchetti',
//     name: 'Marchetti dress',
//     price: 365,
//     fabric: 'velvet',
//     fit: 'bias',
//     status: 'made_to_order',
//     colours: [
//       { name: 'oxblood', hex: '#6B1F2A' },
//       { name: 'emerald', hex: '#255045' },
//     ],
//     sizes: FACTS.sizes,
//     occasions: ['christmas-party', 'new-years-eve'],
//     detail: 'Bias cut velvet, falling from the shoulder.',
//   },
//   {
//     slug: 'noor',
//     name: 'Noor dress',
//     price: 290,
//     fabric: 'crepe',
//     fit: 'A-line',
//     status: 'in_stock',
//     colours: [
//       { name: 'stone', hex: '#CFC6BA' },
//       { name: 'champagne', hex: '#D8C7A9' },
//     ],
//     sizes: FACTS.sizes,
//     occasions: ['winter-wedding', 'christmas-party'],
//     detail: 'An A-line skirt with a covered waistband.',
//   },
//   {
//     slug: 'linden',
//     name: 'Linden dress',
//     price: 340,
//     fabric: 'satin',
//     fit: 'column',
//     status: 'in_stock',
//     colours: [
//       { name: 'champagne', hex: '#D8C7A9' },
//       { name: 'stone', hex: '#CFC6BA' },
//     ],
//     sizes: FACTS.sizes,
//     occasions: ['black-tie', 'christmas-party'],
//     detail: 'Dry satin, with a narrow strap and a low back.',
//   },
//   {
//     slug: 'vesper',
//     name: 'Vesper gown',
//     price: 445,
//     fabric: 'silk',
//     fit: 'bias',
//     status: 'made_to_order',
//     colours: [
//       { name: 'emerald', hex: '#255045' },
//       { name: 'oxblood', hex: '#6B1F2A' },
//     ],
//     sizes: FACTS.sizes,
//     occasions: ['winter-wedding', 'new-years-eve'],
//     detail: 'Floor length, cut on the bias in one piece.',
//   },
// ];

// export const PAIRS_WITH = ['linden', 'noor', 'marchetti'];

// export const getPiece = (slug) => PIECES.find((piece) => piece.slug === slug) || PIECES[0];

// export const occasionName = (id) => OCCASIONS.find((o) => o.id === id)?.name;