import React from "react";

export default function MatchLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 border border-stone/70 p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-stone border-t-oxblood"
      />
      <p className="text-sm text-ink/70">Finding pieces for you...</p>
    </div>
  );
}
