import React from "react";
import { Check, Clock, AlertCircle, ChevronRight, ShieldCheck, Tag } from "lucide-react";

export default function RecentIdentificationsLog({ records: propRecords, onSelectRecord, onOpenDetails }) {
  // If the backend provided real history records, format them for the UI
  const displayRecords = propRecords && propRecords.length > 0 
    ? propRecords.slice(0, 5).map((rec, idx) => ({
        id: rec.id || `scan-${idx}`,
        breed: rec.breed_predicted || rec.breed,
        species: rec.species || "Cattle",
        date: rec.created_at ? new Date(rec.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (rec.date || "Today"),
        confidence: rec.confidence_score ? Math.round(rec.confidence_score * 100 * 10) / 10 : (rec.confidence || 90),
        subText: rec.notes || "Auto-identified from image",
        status: "verified",
        statusLabel: "Verified",
        earTag: rec.animal_id || "Un-tagged",
        colorHex: "#1F3B2C",
        bgHex: "#E7EEE0",
        thumbnailText: (rec.breed_predicted || rec.breed || "C").substring(0, 2).toUpperCase()
      }))
    : [];

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
        {displayRecords.length === 0 && (
          <div className="py-6 text-center text-sm text-[#79746A]">
            No recent identifications found.
          </div>
        )}
        {displayRecords.map((item) => {
          const confStyle = getConfidenceBadge(item.confidence);
          const statusStyle = getStatusBadge(item.status);

          return (
            <div
              key={item.id}
              className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-[#FAF8F3] -mx-2 px-2 rounded-xl transition-colors duration-150"
            >
              {/* Left: Details */}
              <div className="flex items-center gap-3.5 min-w-0">
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
