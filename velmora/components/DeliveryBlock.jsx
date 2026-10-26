import React from 'react';
import ChipGroup from '@/components/ChipGroup';
import { arrivalFor, canArriveBy, day, dayISO, orderByLabel, todayISO } from '@/lib/dates';

export default function DeliveryBlock({ piece, country, onCountry, date, onDate, onShopStock }) {
  const { earliest, latest } = arrivalFor(piece, country);
  const tooLate = Boolean(date) && !canArriveBy(piece, date, country);

  return (
    <section className="border border-stone/70 p-5 md:p-6" aria-label="Delivery">
      <h2 className="eyebrow text-ink/70">Delivery</h2>

      <ChipGroup
        className="mt-4"
        label="Deliver to"
        name="delivery-country"
        value={country}
        onChange={onCountry}
        options={[
          { value: 'UK', label: 'UK' },
          { value: 'EU', label: 'EU' },
        ]}
      />

      <div className="mt-5">
        <label htmlFor="need-by" className="eyebrow block text-ink/70">
          I need it by (optional)
        </label>
        <input
          id="need-by"
          type="date"
          min={todayISO()}
          value={date}
          onChange={(event) => onDate(event.target.value)}
          className="mt-2 min-h-[44px] w-full border border-stone bg-transparent px-3 py-2 text-sm text-ink"
        />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink" aria-live="polite">
        {!date && `Order today, arrives between ${day(earliest)} and ${day(latest)}.`}
        {date && !tooLate &&
          `Order by ${orderByLabel(piece, date, country)} to arrive by ${dayISO(date)}.`}
        {date && tooLate && `This piece will not arrive by ${dayISO(date)}.`}
      </p>

      {date && tooLate && (
        <button
          type="button"
          onClick={onShopStock}
          className="mt-3 min-h-[44px] text-sm text-oxblood underline decoration-stone underline-offset-4 transition-colors hover:decoration-oxblood"
        >
          See pieces that ship from stock
        </button>
      )}
    </section>
  );
}