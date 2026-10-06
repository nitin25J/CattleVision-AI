
import React, { useState } from "react";
import { RefreshCw, CheckCircle2, User, Wifi, WifiOff } from "lucide-react";

export default function TopBar({ onOpenDrawer, userProfile, onSyncClick }) {
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
      onSyncClick?.();
    }, 1200);
  };

  return (
    <header className="w-full bg-[#FAF7F0]/75 backdrop-blur-md sticky top-0 z-30 border-b border-white/60 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Hamburger Menu Button + Offline Sync Status Pill */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Toggle navigation menu"
            className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white/90 border border-white/80 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 shadow-xs backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#173B2B]/20"
          >
            <span className="w-5 h-0.5 bg-[#16291E] rounded-full" />
            <span className="w-5 h-0.5 bg-[#16291E] rounded-full" />
            <span className="w-3.5 h-0.5 bg-[#16291E] rounded-full self-start ml-2.5" />
          </button>

          {/* Offline Sync Status Pill (Light-Green Glass Pill) */}
          <button
            type="button"
            onClick={handleSync}
            title="Click to manually sync cached field records"
            className={`glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-sans font-medium transition-all duration-200 ${
              synced
                ? "text-[#15803D]"
                : "text-[#7A4E1B]"
            }`}
          >
            <span className="relative flex h-2 w-2">
              {!synced && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  synced ? "bg-[#15803D]" : "bg-[#D97706]"
                }`}
              />
            </span>

            <span className="font-semibold">
              {syncing
                ? "Syncing records..."
                : synced
                ? "All Scans Synced"
                : "3 Scans Pending Sync"}
            </span>

            <RefreshCw
              className={`w-3 h-3 ml-0.5 opacity-60 ${syncing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Right Side: User Avatar Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-[#16291E]">Field Worker</div>
            <div className="text-[11px] text-[#79746A]">Gujarat District Unit #4</div>
          </div>

          {/* User Avatar Badge with Online Indicator */}
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#173B2B] text-white flex items-center justify-center font-serif font-bold text-sm shadow-md border-2 border-white">
              FW
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />

            {/* Hover preview */}
            <div className="absolute right-0 top-full mt-2 w-48 p-3 rounded-xl bg-white border border-[#E5E0D5] shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
              <div className="font-semibold text-xs text-[#16291E]">Field Worker ID: FW-409</div>
              <div className="text-[11px] text-[#79746A] mt-0.5">Gujarat Livestock Census</div>
              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-emerald-700 font-medium">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Online Mode
                </span>
                <span>v2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
