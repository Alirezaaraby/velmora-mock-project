import { PIECES } from '@/data/catalog';
import { canArriveBy } from '@/lib/dates';

export const BUDGETS = [
  { value: 'under300', label: 'Under £300', max: 300 },
  { value: 'under400', label: 'Under £400', max: 400 },
  { value: 'under500', label: 'Under £500', max: 500 },
  { value: 'any', label: 'No limit', max: 1000 },
];

const budgetMax = (value) => BUDGETS.find((b) => b.value === value)?.max ?? null;

export function matchesFor(answers = {}) {
  const max = budgetMax(answers.budget);
  const country = answers.country || 'UK';

  return PIECES.filter((piece) => {
    const occasions = Array.isArray(answers.occasion)
      ? answers.occasion
      : answers.occasion
        ? [answers.occasion]
        : [];
    const sizes = Array.isArray(answers.size)
      ? answers.size
      : answers.size
        ? [answers.size]
        : [];

    if (occasions.length && !occasions.some((occasion) => piece.occasions.includes(occasion))) return false;
    if (max && piece.price >= max) return false;
    if (sizes.length && !sizes.some((size) => piece.sizes.includes(size))) return false;
    if (answers.fit && answers.fit !== 'any' && piece.fit.toLowerCase() !== answers.fit) return false;
    if (answers.event_date && !canArriveBy(piece, answers.event_date, country)) return false;
    return true;
  });
}

const ADDRESS_PATTERN =
  /\d+\s+[a-z]{3,}\s+(road|rd|street|st|avenue|ave|lane|ln|close|court|way|place|drive|dr|gardens|walk|crescent|square|hill)\b|\b[a-z]{1,2}\d{1,2}\s?\d?[a-z]{2}\b|\b\d{10,}\b|@/i;

const KNOWN_TOPIC =
  /deliver|arrive|arrival|ship|shipping|return|refund|size|sizing|fit|fabric|jersey|silk|velvet|crepe|satin|price|cost|budget|colour|color|made|making|make|studio|london|occasion|wedding|black tie|party|new year|stock/i;

const UNKNOWN_TOPIC =
  /bespoke|custom|made to measure|tailor|alter|alteration|hem|composition|care|wash|dry clean|discount|offer|sale|voucher|promo|wholesale|stockist|press|collab|size chart|model|height/i;

// Reads a free-text answer without storing anything: it classifies the note,
// refuses anything address-like, and answers only from the facts we hold.
export function readNote(text = '') {
  const value = text.trim();
  if (!value) return { type: 'ok', reply: '' };

  if (ADDRESS_PATTERN.test(value)) return { type: 'address', reply: '' };

  if (UNKNOWN_TOPIC.test(value) && !KNOWN_TOPIC.test(value)) return { type: 'unknown', reply: '' };

  let reply = '';
  if (/deliver|arrive|arrival|ship|shipping/i.test(value)) {
    reply = 'Made-to-order pieces are made in 14 to 21 days, then 3 to 5 days to the UK or 5 to 8 days to the EU.';
  } else if (/return|refund/i.test(value)) {
    reply = 'Returns within 14 days, unworn, with tags. Made-to-order pieces in a non-standard size cannot be returned.';
  } else if (/size|sizing/i.test(value)) {
    reply = 'Sizes run from UK 6 to UK 18. The size selector on each product page shows what is available.';
  } else if (/fabric|jersey|silk|velvet|crepe|satin|fit/i.test(value)) {
    reply = 'The fabric and fit are listed on each product page, under Fabric and fit.';
  } else if (/price|cost|budget/i.test(value)) {
    reply = 'Prices are shown on each product page.';
  } else if (value.includes('?')) {
    return { type: 'unknown', reply: '' };
  }

  return { type: 'ok', reply };
}