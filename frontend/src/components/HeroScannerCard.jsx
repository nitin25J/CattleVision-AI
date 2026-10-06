import React from "react";
import PastoralScene from "./PastoralScene";

export default function HeroScannerCard({ onTriggerScan }) {
  return (
    <div className="w-full rounded-3xl border border-white/50 shadow-xl overflow-hidden mb-6 relative min-h-[460px] sm:min-h-[440px] lg:min-h-[440px] bg-[#163A2A]">
      {/* ── Full-Card Animated Illustration Canvas ───────────────────── */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden rounded-3xl">
        <PastoralScene onTriggerScan={onTriggerScan} />
      </div>

      {/* ── Frosted Glass Left Information Panel ─────────────────────── */}
      <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[460px] sm:min-h-[440px] lg:min-h-[440px] pointer-events-none rounded-3xl overflow-hidden">
        <div className="w-full md:w-[40%] lg:w-[38%] p-5 sm:p-7 lg:p-8 flex flex-col justify-center relative shrink-0 glass-hero-panel pointer-events-auto">
          {/* Heading */}
          <h2 className="text-lg sm:text-2xl lg:text-[26px] font-serif font-bold text-white tracking-tight leading-[1.2] sm:leading-[1.25] mb-2 sm:mb-2.5 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
            Identify Your<br className="hidden sm:inline" /> Cattle Breed
          </h2>

          {/* Professional description with WCAG AA contrast & subtle text-shadow */}
          <p className="text-white text-xs sm:text-[13.5px] font-sans leading-relaxed mb-4 sm:mb-6 max-w-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
            Upload a cattle photo and let AI identify its most likely breed, confidence score, and alternative matches.
          </p>

          {/* CTA Button: Light-Green Glass Pill with Inner Highlight */}
          <div>
            <button
              type="button"
              onClick={onTriggerScan}
              className="glass-pill h-[46px] sm:h-[54px] px-6 sm:px-7 text-[#163A2A] font-sans font-semibold text-xs sm:text-sm whitespace-nowrap inline-flex items-center justify-center gap-2.5 group shadow-md"
            >
              <span>Identify Cattle Breed</span>
              <span className="text-sm sm:text-base font-bold transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* Trust/AI Indicators */}
          <div className="mt-3.5 sm:mt-5 pt-3 sm:pt-4 border-t border-white/20">
            <div className="text-[11px] sm:text-[12px] font-semibold text-white font-sans tracking-wide [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
              AI-Powered Breed Identification
            </div>
            <div className="flex items-center gap-3 sm:gap-3.5 text-[10px] sm:text-[11px] text-emerald-100 font-sans mt-0.5 sm:mt-1">
              <span className="flex items-center gap-1">
                <span className="text-emerald-300 font-bold">✓</span> Confidence Score
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-300 font-bold">✓</span> Alternative Matches
              </span>
            </div>
          </div>
        </div>

        {/* Empty right area allowing clicks to trigger scan */}
        <div
          onClick={onTriggerScan}
          className="flex-1 pointer-events-auto cursor-pointer"
          title="Click to identify cattle breed"
        />
      </div>
    </div>
  );
}
