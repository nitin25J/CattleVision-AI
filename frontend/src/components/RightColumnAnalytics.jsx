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
import { getImageUrl } from "../services/api";

export default function RightColumnAnalytics({ records, onTriggerScan, onOpenDetails }) {
  const [downloading, setDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState(null);
  
  const totalScans = records ? records.length : 0;
  
  // Dynamically calculate Donut chart data from records
  const donutData = React.useMemo(() => {
    if (!records || records.length === 0) return [];
    
    const counts = {};
    records.forEach(rec => {
      const breed = rec.breed_predicted || rec.breed;
      counts[breed] = (counts[breed] || 0) + 1;
    });
    
    const sortedBreeds = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sortedBreeds.slice(0, 2);
    const otherCount = sortedBreeds.slice(2).reduce((sum, [, count]) => sum + count, 0);
    
    const result = [];
    const colors = [
      { color: "#173B2B", bg: "bg-[#173B2B]" },
      { color: "#D97706", bg: "bg-[#D97706]" },
      { color: "#C5D8BE", bg: "bg-[#C5D8BE]" }
    ];
    
    top.forEach(([name, count], idx) => {
      result.push({
        name,
        count,
        percentage: Math.round((count / totalScans) * 100),
        color: colors[idx].color,
        bg: colors[idx].bg
      });
    });
    
    if (otherCount > 0) {
      result.push({
        name: "Other",
        count: otherCount,
        percentage: Math.round((otherCount / totalScans) * 100),
        color: colors[2].color,
        bg: colors[2].bg
      });
    }
    
    return result;
  }, [records, totalScans]);

  const thumbnails = records && records.length > 0 
    ? records.slice(0, 6).map((rec, i) => ({
        id: rec.id ? `Scan #${rec.id}` : `catty_ID_0${i+1}`,
        breed: rec.breed_predicted || rec.breed,
        time: rec.created_at ? new Date(rec.created_at).toLocaleDateString() : "Today",
        tag: rec.animal_id || "Un-tagged",
        color: "#2E5B41"
      }))
    : [];

  // Export Daily Census Report CSV
  const handleExportCensusReport = () => {
    setDownloading(true);
    setTimeout(() => {
      const csvHeader = "Scan ID,Ear Tag,Breed,Species,Confidence,Status,Timestamp\n";
      const csvRows = (!records || records.length === 0) 
        ? ["No records available,,,,,,"]
        : records.map((rec, i) => {
            const id = rec.id || `Scan_${i+1}`;
            const tag = rec.animal_id || "Un-tagged";
            const breed = rec.breed_predicted || rec.breed || "Unknown";
            const species = "Cattle";
            const conf = rec.confidence ? `${(rec.confidence * 100).toFixed(1)}%` : "N/A";
            const status = "Verified";
            const time = rec.created_at ? new Date(rec.created_at).toLocaleString() : new Date().toLocaleString();
            return `${id},${tag},${breed},${species},${conf},${status},"${time}"`;
          }).join("\n");

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
          <span className="text-xs font-sans text-[#79746A] font-medium">{totalScans} Total</span>
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
              {(() => {
                if (donutData.length === 0) return null;
                
                let currentOffset = 0;
                return donutData.map((item, idx) => {
                  // Circumference is 2 * PI * 52 ≈ 326.725
                  const circumference = 326.7256;
                  const dasharray = (item.percentage / 100) * circumference;
                  const circle = (
                    <circle
                      key={item.name}
                      cx="70"
                      cy="70"
                      r="52"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="16"
                      strokeDasharray={`${dasharray} ${circumference}`}
                      strokeDashoffset={-currentOffset}
                      className="transition-all duration-500 hover:opacity-90"
                    />
                  );
                  currentOffset += dasharray;
                  return circle;
                });
              })()}
            </svg>

            {/* Donut Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-serif font-bold text-[#16291E]">{totalScans}</span>
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
          <span className="text-[11px] font-sans text-[#79746A]">{thumbnails.length} previews</span>
        </div>

        {thumbnails.length === 0 && (
          <div className="py-8 text-center text-sm text-[#79746A]">
            No thumbnails available.
          </div>
        )}

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
                className={`group relative p-2.5 rounded-xl border text-left transition-all duration-200 ${isSelected
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
    </div>
  );
}
