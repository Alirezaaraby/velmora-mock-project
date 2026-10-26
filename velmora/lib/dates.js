import { addDays, format, isValid, parseISO, startOfDay } from 'date-fns';
import { FACTS } from '@/data/catalog';

export const todayStart = () => startOfDay(new Date());

export const todayISO = () => format(todayStart(), 'yyyy-MM-dd');

export const day = (date) => format(date, 'd MMM');

export const dayISO = (iso) => (isValid(parseISO(iso)) ? format(parseISO(iso), 'd MMM') : '');

// A made-to-order piece is made in 14 to 21 days, then shipped.
// A piece that ships from stock leaves in 3 days.
const makingWindow = (piece) =>
  piece && piece.status === 'in_stock' ? [FACTS.stockDays, FACTS.stockDays] : FACTS.makingDays;

export function arrivalFor(piece, country = 'UK', from = todayStart()) {
  const [minMaking, maxMaking] = makingWindow(piece);
  const [minShip, maxShip] = FACTS.shipping[country] || FACTS.shipping.UK;
  return {
    earliest: addDays(from, minMaking + minShip),
    latest: addDays(from, maxMaking + maxShip),
  };
}

export const arrivalLabel = (piece, country = 'UK', from = todayStart()) => {
  const { earliest, latest } = arrivalFor(piece, country, from);
  return `${day(earliest)} to ${day(latest)}`;
};

export function canArriveBy(piece, targetISO, country = 'UK', from = todayStart()) {
  if (!isValid(parseISO(targetISO))) return true;
  return parseISO(targetISO) >= arrivalFor(piece, country, from).earliest;
}

export function orderByLabel(piece, targetISO, country = 'UK') {
  if (!isValid(parseISO(targetISO))) return '';
  const [minMaking, maxMaking] = makingWindow(piece);
  const [, maxShip] = FACTS.shipping[country] || FACTS.shipping.UK;
  return day(addDays(parseISO(targetISO), -(maxMaking + maxShip)));
}