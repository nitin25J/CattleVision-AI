import React from "react";
import { Check, Clock, AlertCircle, ChevronRight, ShieldCheck, Tag } from "lucide-react";

export default function RecentIdentificationsLog({ onSelectRecord, onOpenDetails }) {
  const records = [
    {
      id: "scan-01",
      breed: "Vechur",
      species: "Cattle",
      date: "Today",
      confidence: 29.1,
      subText: "Runner-up: Kasargod (24%)",
      status: "unverified",
      statusLabel: "Unverified",
      earTag: "Pending Tag",
      colorHex: "#7A4E1B",
      bgHex: "#FBF3E8",
      thumbnailText: "VC"
    },
    {
      id: "scan-02",
      breed: "Gir",
      species: "Cattle",
      date: "Sep 04, 2026",
      confidence: 98.2,
      subText: "Ear Tag ID: GV-045",
      status: "verified",
      statusLabel: "Verified",
      earTag: "GV-045",
      colorHex: "#B4772E",
      bgHex: "#FBF4EA",
      thumbnailText: "GR"
    },
    {
      id: "scan-03",
      breed: "Sahiwal",
      species: "Cattle",
      date: "Sep 03, 2026",
      confidence: 84.6,
      subText: "Ear Tag ID: SW-102",
      status: "verified",
      statusLabel: "Verified",
      earTag: "SW-102",
      colorHex: "#8A6A3E",
      bgHex: "#F8F4EE",
      thumbnailText: "SH"
    },
    {
      id: "scan-04",
      breed: "Tharparkar",
      species: "Cattle",
      date: "Sep 01, 2026",
      confidence: 62.4,
      subText: "Runner-up: Kankrej (31%)",
      status: "unverified",
      statusLabel: "Unverified",
      earTag: "TP-088",
      colorHex: "#5B6C5D",
      bgHex: "#EEF3EF",
      thumbnailText: "TP"
    },
    {
      id: "scan-05",
      breed: "Ongole",
      species: "Cattle",
      date: "Aug 29, 2026",
      confidence: 91.0,
      subText: "Ear Tag ID: OG-882",
      status: "verified",
      statusLabel: "Verified",
      earTag: "OG-882",
      colorHex: "#395D4A",
      bgHex: "#E9F1EC",
      thumbnailText: "OG"
    }
  ];

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 80) {
      return {
        bg: "bg-[#E7EEE0]",
        text: "text-[#1F5438]",
        border: "border-[#C7DAC0]"
      };
    }
    if (confidence >= 50) {
      return {
        bg: "bg-[#FEF3C7]",
        text: "text-[#92400E]",
        border: "border-[#FDE68A]"
      };
    }
    return {
      bg: "bg-[#FEE2E2]",
      text: "text-[#B91C1C]",
      border: "border-[#FECACA]"
    };
  };

  const getStatusBadge = (status) => {
    if (status === "verified") {
      return {
        bg: "bg-[#DCFCE7]",
        text: "text-[#15803D]",
        border: "border-[#BBF7D0]",
        icon: <ShieldCheck className="w-3 h-3" />
      };
    }
    return {
      bg: "bg-[#F3F4F6]",
      text: "text-[#4B5563]",
      border: "border-[#E5E7EB]",
      icon: <Clock className="w-3 h-3 text-[#9CA3AF]" />
    };
  };

  return (
    <div className="glass p-5 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[#F0ECE1]/60">
        <div>
          <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#16291E]">
            Recent identifications
          </h3>
          <p className="text-xs font-sans text-[#79746A] mt-0.5">
            Verified field records, confidence probabilities, and runner-up classifications.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E2B8]/40 text-[#7A4E1B] border border-[#ECD1A4] text-xs font-semibold whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          <span>Denser Verified Log</span>
        </div>
      </div>

      {/* Denser List of Items */}
      <div className="divide-y divide-[#F2EDE2]">
        {records.map((item) => {
          const confStyle = getConfidenceBadge(item.confidence);
          const statusStyle = getStatusBadge(item.status);

          return (
            <div
              key={item.id}
              className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-[#FAF8F3] -mx-2 px-2 rounded-xl transition-colors duration-150"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* 44x44 Rounded Cattle Thumbnail */}
                <div
                  className="w-11 h-11 min-w-[44px] rounded-xl flex items-center justify-center font-serif font-bold text-sm shadow-inner relative overflow-hidden border border-black/5"
                  style={{ backgroundColor: item.bgHex, color: item.colorHex }}
                >
                  {/* Subtle Cattle Ear & Horn Vector Silhouette */}
                  <svg className="w-7 h-7 opacity-85" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4C9 4 7 5.5 5 8L3 6C2.5 5.5 2 6 2.5 7L4.5 9.5C4.2 10.3 4 11.1 4 12C4 16 7.5 19 12 19C16.5 19 20 16 20 12C20 11.1 19.8 10.3 19.5 9.5L21.5 7C22 6 21.5 5.5 21 6L19 8C17 5.5 15 4 12 4Z" />
                  </svg>
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-sans font-bold tracking-tighter opacity-70">
                    {item.thumbnailText}
                  </span>
                </div>

                {/* Breed Title & Meta */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#16291E] truncate">
                      {item.breed}
                    </h4>
                    <span className="text-[11px] text-[#79746A] whitespace-nowrap">
                      • {item.species} · {item.date}
                    </span>
                  </div>
                  <div className="text-xs text-[#79746A] font-sans truncate mt-0.5">
                    {item.subText}
                  </div>
                </div>
              </div>

              {/* Right: Confidence Badge, Status Pill & Action */}
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-end sm:self-center">
                {/* Confidence Badge */}
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-bold font-sans border ${confStyle.bg} ${confStyle.text} ${confStyle.border}`}
                >
                  {item.confidence}%
                </div>

                {/* Status Pill */}
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                >
                  {statusStyle.icon}
                  <span>{item.statusLabel}</span>
                </div>

                {/* View Details Action */}
                <button
                  type="button"
                  onClick={() => onOpenDetails?.(item.breed, `${item.confidence}%`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#173B2B] bg-[#F2EDE2] hover:bg-[#E5E0D5] border border-[#DDD5C5] transition-colors duration-150 inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
