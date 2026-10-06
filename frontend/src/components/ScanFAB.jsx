import React from "react";
import { Camera, Sparkles } from "lucide-react";

export default function ScanFAB({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Quick Mobile Scan"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[rgba(190,225,195,0.7)] hover:bg-[rgba(205,235,210,0.9)] backdrop-blur-md text-[#163A2A] shadow-[inset_0_1.5px_0_rgba(255,255,255,0.9),0_12px_32px_rgba(22,58,42,0.22)] border-2 border-white/80 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-emerald-700/30"
    >
      <div className="relative flex items-center justify-center">
        <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-[#163A2A] group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D97706] animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D97706]" />
      </div>
      {/* Tooltip on desktop hover */}
      <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#16291E] text-white text-xs font-sans font-medium whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
        Quick Scan Breed
      </span>
    </button>
  );
}
