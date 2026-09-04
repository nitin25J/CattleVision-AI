import React, { useState, useEffect } from "react";
import { fetchHistory, getImageUrl, initialHistoryEntries } from "../services/api";

function AnimalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14c0-4 3-7 8-7s8 3 8 7-3 5-8 5-8-1-8-5Z" />
      <path d="M8 8 6 4M16 8l2-4" />
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

export default function Records({ onNavigate }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchHistory()
      .then((data) => {
        if (isMounted) {
          setHistory(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          // Fallback to localStorage if backend is unreachable
          try {
            const raw = localStorage.getItem("pashuHistory");
            setHistory(raw ? JSON.parse(raw) : initialHistoryEntries);
          } catch (e) {
            setHistory(initialHistoryEntries);
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);


  // Group by date label
  const groups = {};
  history.forEach((e) => {
    const d = e.date || "Past scans";
    groups[d] = groups[d] || [];
    groups[d].push(e);
  });

  return (
    <section className="screen active" id="screen-history">
      <p className="eyebrow">History</p>
      <h1 className="page-title">Identification history</h1>
      <p className="page-subtitle">A record of your recent breed identifications.</p>

      <div id="historyContent">
        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <AnimalIcon />
            </div>
            <div className="empty-title">Your identifications will appear here.</div>
            <div className="empty-sub">Identify your first animal to get started.</div>
            <button className="btn btn-primary" onClick={() => onNavigate("identify")}>
              Identify an animal
            </button>
          </div>
        ) : (
          Object.keys(groups).map((date) => (
            <div key={date} className="history-group">
              <div className="history-date">{date}</div>
              {groups[date].map((e, idx) => {
                const conf = getConfidenceStyle(e.confidence);
                return (
                  <div key={idx} className="history-card">
                    <div className="history-thumb">
                      <AnimalIcon />
                    </div>
                    <div className="history-info">
                      <div className="history-breed">{e.breed}</div>
                      <div className="history-meta">{e.species}</div>
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
          ))
        )}
      </div>
    </section>
  );
}