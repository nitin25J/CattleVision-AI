import React from "react";
import { breedLibrary } from "../services/api";

export default function VerificationCard({ breedName, confidence, onClose }) {
  const info = breedLibrary[breedName] || breedLibrary["Gir"];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center">
      <div className="bg-[var(--bg)] w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-[28px] md:rounded-[var(--radius-lg)] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[var(--hairline)] flex items-center justify-center text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <div className="w-10 h-1 bg-[var(--hairline)] rounded-full mx-auto mb-4 md:hidden" />
        <div className="text-xs font-bold text-[var(--forest-mid)] mb-1">{info.species}</div>
        <div className="font-display text-3xl font-semibold text-[var(--forest-deep)] mb-4">{breedName}</div>
        
        <div className="text-xs font-bold text-[var(--muted)] mb-2">About</div>
        <p className="text-sm leading-relaxed text-[var(--charcoal)] mb-5">{info.about}</p>

        <div className="text-xs font-bold text-[var(--muted)] mb-2">Characteristics</div>
        <div className="flex flex-wrap gap-2 mb-6">
          {info.characteristics.map((char) => (
            <span key={char} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--sage-soft)] text-[var(--forest-mid)]">
              {char}
            </span>
          ))}
        </div>

        <div className="text-xs font-bold text-[var(--muted)] mb-1">Confidence Score</div>
        <div className="font-display text-2xl font-semibold text-[var(--forest-deep)]">{confidence}%</div>
      </div>
    </div>
  );
}