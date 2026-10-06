
import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, User, Wifi, WifiOff } from "lucide-react";
import { API_BASE_URL } from "../services/api";

export default function TopBar({ onOpenDrawer, userProfile, onSyncClick }) {
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/docs`, { method: "HEAD" });
        setIsLive(res.ok);
      } catch (e) {
        setIsLive(false);
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);



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

        </div>

        {/* Right Side: LIVE Indicator Only */}
        <div className="flex items-center">
          {isLive && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold uppercase tracking-widest text-[10px]">Live</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
