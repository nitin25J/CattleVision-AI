import React, { useState } from "react";
import {
  PieChart,
  FileSpreadsheet,
  Download,
  MapPin,
  Search,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  Layers
} from "lucide-react";

export default function RightColumnAnalytics({ onTriggerScan, onOpenDetails }) {
  const [downloading, setDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState(null);

  // Donut chart data: Gir (60%), Sahiwal (30%), Other (10%)
  const donutData = [
    { name: "Gir", percentage: 60, count: 6, color: "#173B2B", bg: "bg-[#173B2B]" },
    { name: "Sahiwal", percentage: 30, count: 3, color: "#D97706", bg: "bg-[#D97706]" },
    { name: "Other", percentage: 10, count: 1, color: "#C5D8BE", bg: "bg-[#C5D8BE]" }
  ];

  // 6 Cattle preview chips
  const thumbnails = [
    { id: "catty_ID_01", breed: "Gir", time: "10m ago", tag: "GV-045", color: "#B4772E" },
    { id: "catty_ID_02", breed: "Vechur", time: "42m ago", tag: "VC-012", color: "#7A4E1B" },
    { id: "catty_ID_03", breed: "Sahiwal", time: "2h ago", tag: "SW-102", color: "#D97706" },
    { id: "catty_ID_04", breed: "Ongole", time: "5h ago", tag: "OG-882", color: "#2E5B41" },
    { id: "catty_ID_05", breed: "Tharparkar", time: "Yesterday", tag: "TP-088", color: "#5B6C5D" },
    { id: "catty_ID_06", breed: "Kankrej", time: "Sep 02", tag: "KK-331", color: "#455A64" }
  ];

  // Export Daily Census Report CSV
  const handleExportCensusReport = () => {
    setDownloading(true);
    setTimeout(() => {
      const csvHeader = "Scan ID,Ear Tag,Breed,Species,Confidence,Status,Timestamp\n";
      const csvRows = [
        "catty_ID_01,GV-045,Gir,Cattle,98.2%,Verified,2026-09-04 10:15",
        "catty_ID_02,VC-012,Vechur,Cattle,29.1%,Unverified,2026-09-04 09:33",
        "catty_ID_03,SW-102,Sahiwal,Cattle,84.6%,Verified,2026-09-03 16:40",
        "catty_ID_04,OG-882,Ongole,Cattle,91.0%,Verified,2026-09-02 11:20",
        "catty_ID_05,TP-088,Tharparkar,Cattle,62.4%,Unverified,2026-09-01 14:05",
        "catty_ID_06,KK-331,Kankrej,Cattle,88.5%,Verified,2026-08-30 08:50"
      ].join("\n");

      const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `CattleVision_Census_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── CARD 1: Scans Distribution by Breed ─────────────────────── */}
      <div className="glass glass-hover p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0ECE1]/60">
          <h3 className="text-base font-serif font-semibold text-[#16291E]">
            Scans Distribution by Breed
          </h3>
          <span className="text-xs font-sans text-[#79746A] font-medium">10 Total</span>
        </div>

        {/* Donut Chart Visual */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          {/* SVG Donut */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
              {/* Background ring */}
              <circle
                cx="70"
                cy="70"
                r="52"
                fill="none"
                stroke="#F2EDE2"
                strokeWidth="16"
              />
              {/* Gir (60%) -> 60% of 326.73 ≈ 196.04 */}
              <circle
                cx="70"
                cy="70"
                r="52"
                fill="none"
                stroke="#173B2B"
                strokeWidth="16"
                strokeDasharray="196.04 326.73"
                strokeDashoffset="0"
                className="transition-all duration-500 hover:opacity-90"
              />
              {/* Sahiwal (30%) -> 30% of 326.73 ≈ 98.02 */}
              <circle
                cx="70"
                cy="70"
                r="52"
                fill="none"
                stroke="#D97706"
                strokeWidth="16"
                strokeDasharray="98.02 326.73"
                strokeDashoffset="-196.04"
                className="transition-all duration-500 hover:opacity-90"
              />
              {/* Other (10%) -> 10% of 326.73 ≈ 32.67 */}
              <circle
                cx="70"
                cy="70"
                r="52"
                fill="none"
                stroke="#C5D8BE"
                strokeWidth="16"
                strokeDasharray="32.67 326.73"
                strokeDashoffset="-294.06"
                className="transition-all duration-500 hover:opacity-90"
              />
            </svg>

            {/* Donut Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-serif font-bold text-[#16291E]">10</span>
              <span className="text-[10px] font-sans font-medium text-[#79746A] uppercase tracking-wider">
                Scans
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex flex-col gap-2.5 w-full sm:w-auto">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-4 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${item.bg} shrink-0`} />
                  <span className="font-medium text-[#2A281F]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#16291E]">{item.percentage}%</span>
                  <span className="text-[#9CA3AF] text-[11px]">({item.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CARD 2: Recent Scan Image Thumbnails ────────────────────── */}
      <div className="glass glass-hover p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0ECE1]/60">
          <h3 className="text-base font-serif font-semibold text-[#16291E]">
            Recent Scan Image Thumbnails
          </h3>
          <span className="text-[11px] font-sans text-[#79746A]">6 previews</span>
        </div>

        {/* 6-Chip Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {thumbnails.map((thumb) => {
            const isSelected = activeChip === thumb.id;
            return (
              <button
                key={thumb.id}
                type="button"
                onClick={() => {
                  setActiveChip(isSelected ? null : thumb.id);
                  onOpenDetails?.(thumb.breed, "Recent");
                }}
                className={`group relative p-2.5 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "border-[#173B2B] bg-white/70 shadow-sm"
                    : "border-white/60 bg-white/30 hover:bg-white/60 hover:border-white/90"
                }`}
              >
                {/* Visual miniature cattle badge */}
                <div
                  className="w-full h-14 rounded-lg flex items-center justify-center mb-2 shadow-inner relative overflow-hidden"
                  style={{ backgroundColor: `${thumb.color}15`, color: thumb.color }}
                >
                  <svg className="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4C9 4 7 5.5 5 8L3 6C2.5 5.5 2 6 2.5 7L4.5 9.5C4.2 10.3 4 11.1 4 12C4 16 7.5 19 12 19C16.5 19 20 16 20 12C20 11.1 19.8 10.3 19.5 9.5L21.5 7C22 6 21.5 5.5 21 6L19 8C17 5.5 15 4 12 4Z" />
                  </svg>
                  <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>

                <div className="font-sans font-semibold text-xs text-[#16291E] truncate">
                  {thumb.id}
                </div>
                <div className="text-[10px] text-[#79746A] truncate">
                  {thumb.breed} • {thumb.time}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CARD 3: Quick Actions ───────────────────────────────────── */}
      <div className="glass glass-hover p-5">
        <h3 className="text-base font-serif font-semibold text-[#16291E] mb-3 pb-2 border-b border-[#F0ECE1]/60">
          Quick Actions
        </h3>

        {/* Generate Daily Census Report Button (Soft sage green glass) */}
        <button
          type="button"
          onClick={handleExportCensusReport}
          disabled={downloading}
          className="w-full py-3 px-4 rounded-xl font-sans font-semibold text-xs sm:text-sm bg-white/50 hover:bg-white/70 text-[#173B2B] border border-white/80 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 group backdrop-blur-sm"
        >
          {downloading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#173B2B] border-t-transparent rounded-full animate-spin" />
              <span>Generating Census Report...</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4 text-[#2E5B41] group-hover:scale-110 transition-transform" />
              <span>Generate Daily Census Report (PDF/CSV)</span>
              <Download className="w-3.5 h-3.5 ml-auto opacity-70" />
            </>
          )}
        </button>

        <p className="text-[11px] font-sans text-[#79746A] mt-2.5 text-center">
          Includes verified ear tag IDs, GPS coordinates, and classification accuracy.
        </p>
      </div>

      {/* ── CARD 4: Local Animal Hospitals (Integration Placeholder) ─── */}
      <div className="glass glass-hover p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0ECE1]/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D97706]" />
            <h3 className="text-base font-serif font-semibold text-[#16291E]">
              Local Animal Hospitals
            </h3>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-sans font-semibold text-[#173B2B] hover:text-[#2E5B41] hover:underline inline-flex items-center gap-1"
          >
            <span>Google Map</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Search Input Bar */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vet clinics or emergency posts..."
            className="w-full pl-8 pr-3 py-2 text-xs font-sans bg-[#FBF8F1] border border-[#E5E0D5] rounded-lg focus:outline-none focus:border-[#173B2B] text-[#2A281F]"
          />
        </div>

        {/* Map Viewport Container (Placeholder with Marker and Google Logo) */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#E5E0D5] bg-[#F4F1EA] flex flex-col items-center justify-center p-4 text-center group">
          {/* Subtle Map Grid lines simulation */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#DDD5C5 1px, transparent 1px), linear-gradient(90deg, #DDD5C5 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          />

          {/* Map pin pulse animation */}
          <div className="relative z-10 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#173B2B]/10 flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6 text-[#173B2B] animate-bounce" />
            </div>
          </div>

          <div className="relative z-10 font-sans font-semibold text-xs text-[#2A281F] max-w-[210px] leading-snug">
            Map and hospital locations pending integration
          </div>
          <p className="relative z-10 text-[10px] text-[#79746A] mt-0.5">
            Hook ready for Google Maps JavaScript SDK
          </p>

          {/* Google Logo Placeholder (Bottom-left) */}
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-sans font-medium text-gray-600 border border-gray-200">
            <span className="font-bold tracking-tight">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
          </div>

          {/* Coordinates indicator */}
          <div className="absolute bottom-2 right-2 z-10 text-[9px] font-mono text-gray-500 bg-white/80 px-1.5 py-0.5 rounded">
            23.0225° N, 72.5714° E
          </div>
        </div>

        {/* Emergency Vet Contact Helpline */}
        <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-[#FDF8ED] border border-[#ECD1A4]/60 text-xs">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="font-sans font-medium text-[#7A4E1B]">Emergency Helpline</span>
          </div>
          <span className="font-mono font-bold text-[#92400E]">1962 (Toll Free)</span>
        </div>
      </div>
    </div>
  );
}
