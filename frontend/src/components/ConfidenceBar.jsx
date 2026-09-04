import React from "react";

export default function ConfidenceBar({ confidence, isLow }) {
  return (
    <div className="w-full">
      <div className="h-3 rounded-full bg-[var(--surface-sunk)] overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isLow
              ? "bg-[var(--amber)]"
              : "bg-gradient-to-r from-[var(--sage)] to-[var(--forest-mid)]"
          }`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <div
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
          isLow
            ? "bg-[var(--amber-soft)] text-[var(--amber-deep)]"
            : "bg-[var(--sage-soft)] text-[var(--forest-mid)]"
        }`}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isLow ? (
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </>
          ) : (
            <path d="M20 6 9 17l-5-5" />
          )}
        </svg>
        {isLow ? "Low confidence" : "High confidence"}
      </div>
    </div>
  );
}