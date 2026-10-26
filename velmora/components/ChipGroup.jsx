'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';

const REMOTE_OPTIONS = {
  occasion: 'occasions',
  size: 'sizes',
};

export default function ChipGroup({ label, name, options = [], value, onChange, className }) {
  const table = REMOTE_OPTIONS[name];
  const [remoteOptions, setRemoteOptions] = useState([]);
  const [remoteLoading, setRemoteLoading] = useState(Boolean(table));
  const [remoteError, setRemoteError] = useState('');

  useEffect(() => {
    if (!table) return;

    let active = true;

    const loadOptions = async () => {
      try {
        const { data, error } = await createClient()
          .from(table)
          .select('id,name');

        if (!active) return;

        if (error) {
          setRemoteError(error.message);
          setRemoteLoading(false);
          return;
        }

        setRemoteOptions(
          (data || []).map((option) => ({
            value: option.id,
            label: option.name,
          })),
        );
        setRemoteLoading(false);
      } catch (error) {
        if (!active) return;
        setRemoteError(error instanceof Error ? error.message : 'Unknown error');
        setRemoteLoading(false);
      }
    };

    void loadOptions();

    return () => {
      active = false;
    };
  }, [table]);

  const visibleOptions = table ? remoteOptions : options;
  const isMultiSelect = name === 'occasion' || name === 'size';
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <div className={className}>
      {label && <p className="eyebrow mb-4 text-ink/70">{label}</p>}
      <div role="group" aria-label={label || name} className="flex flex-wrap gap-3">
        {table && remoteError && (
          <p className="text-sm text-oxblood">We couldn&apos;t load the {name}s: {remoteError}</p>
        )}
        {table && remoteLoading && (
          <p className="text-sm text-ink/70">Loading {name}s...</p>
        )}
        {table && !remoteLoading && !remoteError && visibleOptions.length === 0 && (
          <p className="text-sm text-ink/70">No {name}s are available yet.</p>
        )}
        {visibleOptions.map((option) => {
          const selected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                if (!isMultiSelect) {
                  onChange(option.value);
                  return;
                }

                onChange(
                  selected
                    ? selectedValues.filter((selectedValue) => selectedValue !== option.value)
                    : [...selectedValues, option.value],
                );
              }}
              className={cn(
                'min-h-[44px] rounded-full border px-5 text-xs uppercase tracking-[0.16em] transition-colors',
                selected
                  ? 'border-2 border-ink bg-white text-oxblood text-sm'
                  : 'border-stone bg-transparent text-ink hover:border-ink',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}