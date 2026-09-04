import React, { useEffect, useState } from "react";
import { fetchDashboardStats, fetchHistory, initialHistoryEntries, weeklyConfidence } from "../services/api";

function AnimalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14c0-4 3-7 8-7s8 3 8 7-3 5-8 5-8-1-8-5Z" />
      <path d="M8 8 6 4M16 8l2-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}>
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <circle cx="7" cy="7" r=".5" fill="currentColor" />
    </svg>
  );
}

function getConfidenceStyle(confidence) {
  if (confidence >= 85) {
    return {
      color: "var(--forest-mid)",
      bg: "var(--sage-soft)",
      border: "rgba(46, 91, 65, 0.15)"
    };
  }
  if (confidence >= 70) {
    return {
      color: "var(--amber-deep)",
      bg: "var(--amber-soft)",
      border: "rgba(180, 119, 46, 0.2)"
    };
  }
  return {
    color: "#B91C1C",
    bg: "#FEE2E2",
    border: "rgba(185, 28, 28, 0.2)"
  };
}

export default function Home({ onNavigate }) {
  const [counts, setCounts] = useState({ identified: 0, confidence: 0, breeds: 0 });
  const [recentEntries, setRecentEntries] = useState(initialHistoryEntries);
  const [weeklyChartData, setWeeklyChartData] = useState(weeklyConfidence);
  const [thisWeekCount, setThisWeekCount] = useState(0);

  useEffect(() => {
    let frameId;

    const loadData = async () => {
      try {
        const stats = await fetchDashboardStats();
        const historyData = await fetchHistory();

        if (historyData && historyData.length > 0) {
          setRecentEntries(historyData.slice(0, 3));
        }
        if (stats && stats.weekly_confidence) {
          setWeeklyChartData(stats.weekly_confidence);
          setThisWeekCount(stats.this_week_count || 0);
        }

        const targetIdentified = stats ? stats.total_identified : 0;
        const targetConfidence = stats ? Math.round(stats.avg_confidence) : 0;
        const targetBreeds = stats ? stats.breeds_covered : 0;

        const duration = 900;
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCounts({
            identified: Math.round(targetIdentified * ease),
            confidence: Math.round(targetConfidence * ease),
            breeds: Math.round(targetBreeds * ease)
          });
          if (progress < 1) {
            frameId = requestAnimationFrame(step);
          }
        };
        frameId = requestAnimationFrame(step);
      } catch (err) {
        // Fallback to mock counts animation if backend offline
        const duration = 900;
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCounts({
            identified: Math.round(24 * ease),
            confidence: Math.round(91 * ease),
            breeds: Math.round(8 * ease)
          });
          if (progress < 1) {
            frameId = requestAnimationFrame(step);
          }
        };
        frameId = requestAnimationFrame(step);
      }
    };

    loadData();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  const maxWeekly = Math.max(...weeklyChartData.map((d) => d.value || 0), 1);


  return (
    <section className="screen active" id="screen-dashboard">
      {/* Personalized Header */}
      <div className="greeting-row">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="page-title">Good morning, Field Worker</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>
            Here is today&apos;s livestock identification activity and census overview.
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-grid">
          <div>
            <h2>Identify a livestock breed</h2>
            <p>
              Upload a photo and let AI identify the most likely breed, with confidence scoring and alternative matches.
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate("identify")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Identify breed
            </button>
          </div>
          <div className="hero-visual">
            <svg className="cattle-illustration" viewBox="0 0 200 160" fill="none">
              <ellipse cx="100" cy="130" rx="70" ry="6" fill="#0F1F15" />
              <path
                d="M45 70 C40 55 55 42 78 42 L128 42 C150 42 162 58 158 76 L154 100 C152 112 140 120 126 120 L64 120 C50 120 40 110 40 96 Z"
                fill="#3C6B4C"
                stroke="#DCE6D6"
                strokeWidth="1.4"
              />
              <path
                className="horn-left"
                d="M62 44 C58 30 66 20 76 22 C80 28 76 40 70 46"
                fill="#3C6B4C"
                stroke="#DCE6D6"
                strokeWidth="1.4"
              />
              <path
                className="horn-right"
                d="M132 44 C136 30 128 20 118 22 C114 28 118 40 124 46"
                fill="#3C6B4C"
                stroke="#DCE6D6"
                strokeWidth="1.4"
              />
              <ellipse cx="90" cy="66" rx="22" ry="17" fill="#4A7D59" />
              <g className="eyes">
                <ellipse cx="82" cy="68" rx="3" ry="4" fill="#16291E" />
                <ellipse cx="98" cy="68" rx="3" ry="4" fill="#16291E" />
              </g>
              <path d="M80 78 Q90 84 100 78" stroke="#16291E" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <rect x="48" y="112" width="10" height="20" rx="4" fill="#2E5B41" />
              <rect x="80" y="116" width="10" height="20" rx="4" fill="#2E5B41" />
              <rect x="112" y="116" width="10" height="20" rx="4" fill="#2E5B41" />
              <rect x="140" y="108" width="10" height="20" rx="4" fill="#2E5B41" />
              <circle cx="150" cy="60" r="14" fill="#AFC6A3" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Enhanced Stat Cards with Icons & Trend Indicators */}
      <div className="stats-row">
        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--sage-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--forest-mid)"
              }}
            >
              <CheckIcon />
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--forest-mid)",
                background: "var(--sage-soft)",
                padding: "3px 9px",
                borderRadius: "999px"
              }}
            >
              +3 this week
            </span>
          </div>
          <div className="stat-value">{counts.identified}</div>
          <div className="stat-label">Identified</div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--sage-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--forest-mid)"
              }}
            >
              <TargetIcon />
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--forest-mid)",
                background: "var(--sage-soft)",
                padding: "3px 9px",
                borderRadius: "999px"
              }}
            >
              +2.4% vs last wk
            </span>
          </div>
          <div className="stat-value">{counts.confidence}%</div>
          <div className="stat-label">Avg. confidence</div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--sage-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--forest-mid)"
              }}
            >
              <TagIcon />
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--forest-mid)",
                background: "var(--sage-soft)",
                padding: "3px 9px",
                borderRadius: "999px"
              }}
            >
              +1 new breed
            </span>
          </div>
          <div className="stat-value">{counts.breeds}</div>
          <div className="stat-label">Breeds covered</div>
        </div>
      </div>

      {/* Recent Identifications Section (Visually matches History page styling with color-coded confidence) */}
      <div className="section-row">
        <h3 className="section-title" style={{ marginBottom: 0 }}>
          Recent identifications
        </h3>
        <span className="link-small" onClick={() => onNavigate("history")}>
          View all
        </span>
      </div>
      <div className="recent-list" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "34px" }}>
        {recentEntries.map((e, idx) => {
          const conf = getConfidenceStyle(e.confidence);
          return (
            <div key={idx} className="history-card" style={{ marginBottom: 0 }}>
              <div className="history-thumb">
                <AnimalIcon />
              </div>
              <div className="history-info">
                <div className="history-breed">{e.breed}</div>
                <div className="history-meta">
                  {e.species} · {e.date}
                </div>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "4px 11px",
                  borderRadius: "999px",
                  color: conf.color,
                  backgroundColor: conf.bg,
                  border: `1px solid ${conf.border}`,
                  letterSpacing: "0.01em"
                }}
              >
                {e.confidence}%
              </div>
            </div>
          );
        })}
      </div>

      {/* How it Works Section */}
      <h3 className="section-title">How CattleVision AI works</h3>
      <div className="steps-row">
        <div className="step-card">
          <span className="step-num">01</span>
          <div className="step-title">Capture</div>
          <div className="step-desc">Take or upload a clear photo of the animal in good light.</div>
        </div>
        <div className="step-card">
          <span className="step-num">02</span>
          <div className="step-title">Analyze</div>
          <div className="step-desc">The model compares visual characteristics against known breeds.</div>
        </div>
        <div className="step-card">
          <span className="step-num">03</span>
          <div className="step-title">Identify</div>
          <div className="step-desc">Get the most likely breed with a confidence score and top matches.</div>
        </div>
      </div>

      {/* Weekly Insight Overview */}
      <h3 className="section-title">Identification overview</h3>
      <div className="insight-card">
        <div className="insight-head">
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--charcoal)" }}>Confidence this week</span>
          <span className="insight-avg">
            avg <b>{counts.confidence > 0 ? `${counts.confidence}%` : "87%"}</b>
          </span>
        </div>
        <div className="chart-row" id="insightChart">
          {weeklyChartData.map((d, i) => {
            const val = d.value > 0 ? d.value : (weeklyConfidence[i] ? weeklyConfidence[i].value : 75);
            const maxVal = Math.max(...weeklyChartData.map(w => w.value > 0 ? w.value : 0), 100);
            const barHeightPct = Math.min(Math.max((val / maxVal) * 100, 20), 100);
            return (
              <div key={i} className="chart-col">
                <span className="chart-val">{Math.round(val)}%</span>
                <div className="chart-bar-wrap">
                  <div
                    className="chart-bar"
                    style={{ height: `${barHeightPct}%` }}
                  ></div>
                </div>
                <div className="chart-day">{d.day}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}