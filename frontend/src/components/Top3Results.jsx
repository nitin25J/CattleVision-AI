import React from "react";

export default function Top3Results({ alternatives = [] }) {
  return (
    <div className="space-y-2.5 mb-6">
      {alternatives.map((alt, idx) => (
        <div
          key={alt.breed}
          className="bg-white border border-[var(--hairline)] rounded-[var(--radius-md)] p-3.5 flex items-center gap-3.5 shadow-sm"
        >
          <span className="font-display text-sm font-semibold text-[var(--muted)] w-5">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold text-[var(--charcoal)]">
                {alt.breed} <span className="text-xs text-[var(--muted)] font-normal">· {alt.species}</span>
              </span>
              <span className="font-bold text-[var(--forest-deep)]">{alt.confidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--surface-sunk)] overflow-hidden">
              <div
                className="h-full bg-[var(--sage)] rounded-full transition-all duration-500"
                style={{ width: `${alt.confidence}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}