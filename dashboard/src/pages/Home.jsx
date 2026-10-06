import React, { useEffect, useState } from "react";
import { fetchDashboardStats, fetchHistory } from "../services/api";
import HeroScannerCard from "../components/HeroScannerCard";
import KpiMetricCards from "../components/KpiMetricCards";
import RecentIdentificationsLog from "../components/RecentIdentificationsLog";
import RightColumnAnalytics from "../components/RightColumnAnalytics";
import { Sparkles, Calendar, MapPin, CheckCircle, Info } from "lucide-react";

export default function Home({ onNavigate, onOpenDetails }) {
  const [stats, setStats] = useState({
    total_identified: 10,
    avg_confidence: 44,
    breeds_covered: 4,
    this_week_count: 3
  });

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        if (data) {
          setStats((prev) => ({
            ...prev,
            total_identified: data.total_identified ?? prev.total_identified,
            avg_confidence: data.avg_confidence ?? prev.avg_confidence,
            breeds_covered: data.breeds_covered ?? prev.breeds_covered,
            this_week_count: data.this_week_count ?? prev.this_week_count
          }));
        }
      })
      .catch(() => {
        // Keep default field demo stats if offline
      });
  }, []);

  const handleTriggerScan = () => {
    onNavigate("identify");
  };

  return (
    <div className="w-full bg-[#FAF7F0] min-h-screen text-[#2A281F] pb-16 font-sans relative overflow-x-hidden">
      {/* ── Colorful Blurred Background Blobs (for glass refraction) ── */}
      <div className="fixed top-[-80px] right-[-80px] w-[520px] h-[520px] bg-[#CFE8CF]/65 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-[32%] left-[-120px] w-[460px] h-[460px] bg-[#B9CDB3]/50 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-60px] right-[15%] w-[420px] h-[420px] bg-[#F6D9A8]/50 rounded-full blur-[95px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* ── Greeting Section ────────────────────────────────────── */}
        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7A4E1B] mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span>Overview</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-bold text-[#16291E] tracking-tight leading-tight">
              Good morning, Field Worker
            </h1>
            <p className="text-sm sm:text-base text-[#79746A] mt-1.5 font-sans max-w-2xl">
              Here is today&apos;s livestock identification activity and census overview.
            </p>
          </div>

          {/* Quick Date and Location Badge (Glass Pill) */}
          <div className="glass-pill inline-flex items-center gap-3 px-4 py-2 text-xs font-medium text-[#163A2A] self-start md:self-auto shadow-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#163A2A]" />
              <span className="font-semibold">Sep 30, 2026</span>
            </div>
            <span className="text-[#A8B89A]">|</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="font-semibold">Zone 4 (Gujarat)</span>
            </div>
          </div>
        </div>

        {/* ── 12-Column Responsive Grid Architecture ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ── LEFT SECTION (8 Columns) ──────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Interactive Animated Hero Scanner Card */}
            <HeroScannerCard onTriggerScan={handleTriggerScan} />

            {/* Metric KPI Cards (3-Column Grid) */}
            <KpiMetricCards stats={stats} />

            {/* Denser Recent Identifications Log */}
            <RecentIdentificationsLog
              onSelectRecord={(rec) => onNavigate("history")}
              onOpenDetails={onOpenDetails}
            />

            {/* How It Works Micro-Card (Integrated below log for field workers) */}
            <div className="glass p-5 shadow-sm mt-1">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0ECE1]">
                <h4 className="text-sm font-serif font-semibold text-[#16291E]">
                  Field Protocol & Best Practices
                </h4>
                <span className="text-[11px] font-sans text-[#79746A]">3 Steps</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#FBF8F1] border border-[#EBE5D8]">
                  <span className="text-xs font-bold text-[#2E5B41] font-mono">01 Capture</span>
                  <p className="text-xs text-[#565147] mt-1 leading-snug">
                    Take lateral profile in natural daylight avoiding shadows.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#FBF8F1] border border-[#EBE5D8]">
                  <span className="text-xs font-bold text-[#D97706] font-mono">02 AI Inference</span>
                  <p className="text-xs text-[#565147] mt-1 leading-snug">
                    EfficientNet-B0 analyzes dewlap, horn shape & forehead.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#FBF8F1] border border-[#EBE5D8]">
                  <span className="text-xs font-bold text-[#173B2B] font-mono">03 Verification</span>
                  <p className="text-xs text-[#565147] mt-1 leading-snug">
                    Attach ear tag ID, verify breed, and sync census record.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT SECTION (4 Columns) ─────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col">
            <RightColumnAnalytics
              onTriggerScan={handleTriggerScan}
              onOpenDetails={onOpenDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
}