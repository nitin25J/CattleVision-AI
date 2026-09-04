import React, { useState, useEffect } from "react";
import { predictionData } from "../services/api";

export default function Result({ usePredictionHook, onNavigate, onOpenDetails }) {
  const { prediction, setPrediction, imagePreview, activeMode, setActiveMode } = usePredictionHook;
  const currentData = prediction || predictionData.high;
  const isHigh = currentData.confidence >= 50;

  const [displayedConf, setDisplayedConf] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    // Animate confidence number
    const target = currentData.confidence;
    const duration = 900;
    const start = performance.now();
    let frameId;

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedConf(Math.round(target * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayedConf(target);
      }
    };
    frameId = requestAnimationFrame(step);

    const timer = setTimeout(() => {
      setBarWidth(target);
    }, 300);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [currentData]);

  const handleToggleMode = (mode) => {
    setActiveMode(mode);
    const data = predictionData[mode];
    setPrediction(data);
    setBarWidth(0);
  };

  return (
    <section className="screen active" id="screen-result">
      <p className="eyebrow">Result</p>
      <h1 className="page-title">Identification result</h1>
      <p className="page-subtitle">Based on the visual characteristics in your photo.</p>

      {/* Result Image Card */}
      {imagePreview && (
        <div className="result-image-card reveal-io in" id="resultImageCard">
          <img id="resultImg" src={imagePreview} alt="Identified animal" />
          <div className="result-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
            </svg>
            AI analysis complete
          </div>
        </div>
      )}

      {/* Result Hero Card */}
      <div className="result-hero-card">
        <div className="result-label">Most likely breed</div>
        <div className="result-breed-row">
          <div className="reveal-io in" id="resultBreedWrap">
            <div className="result-breed-name" id="resultBreed">
              {currentData.breed}
            </div>
            <div className="result-species" id="resultSpecies">
              {currentData.species}
            </div>
          </div>
          <div className="reveal-io in" id="resultConfWrap" style={{ textAlign: "right" }}>
            <div className="result-conf-num" id="resultConfNum">
              {displayedConf}
              <span>%</span>
            </div>
          </div>
        </div>

        <div className="conf-bar-track reveal-io in" id="resultBarWrap">
          <div
            className="conf-bar-fill"
            id="resultConfBar"
            style={{
              width: `${barWidth}%`,
              background: isHigh
                ? "linear-gradient(90deg, var(--sage), var(--forest-mid))"
                : "var(--amber)"
            }}
          ></div>
        </div>

        {isHigh ? (
          <div className="conf-tag high reveal-io in" id="resultConfTag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            High confidence
          </div>
        ) : (
          <div className="conf-tag low reveal-io in" id="resultConfTag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            Low confidence
          </div>
        )}
      </div>

      {/* Top 3 Matches */}
      <h3 className="section-title">Top 3 matches</h3>
      <div className="matches-list" id="matchesList">
        {currentData.alternatives.map((alt, i) => (
          <div key={i} className="match-card">
            <div className="match-rank">{String(i + 1).padStart(2, "0")}</div>
            <div className="match-info">
              <div className="match-breed-row">
                <span className="match-breed">
                  {alt.breed} <span className="match-species">· {alt.species}</span>
                </span>
                <span className="match-pct">{alt.confidence}%</span>
              </div>
              <div className="match-bar-track">
                <div className="match-bar-fill" style={{ width: `${alt.confidence}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confidence Interpretation */}
      <h3 className="section-title">Confidence interpretation</h3>
      <div className={`interp-card reveal-io in ${!isHigh ? "low" : ""}`} id="interpCard">
        <div className="interp-head">
          <span className="interp-pct" id="interpPct">
            {currentData.confidence}%
          </span>
          <span className="interp-label" id="interpLabel">
            {isHigh ? "High confidence" : "Low confidence"}
          </span>
        </div>
        <div className="interp-text" id="interpText">
          {isHigh
            ? "The image contains visual characteristics that strongly match the predicted breed."
            : "The prediction is uncertain. Try a clearer image for a more reliable result."}
        </div>
      </div>

      {/* Action Buttons */}
      {isHigh ? (
        <div className="result-actions reveal-io in" id="resultActionsHigh">
          <button
            className="btn btn-primary"
            onClick={() => onOpenDetails(currentData.breed, `${currentData.confidence}%`)}
          >
            View breed details
          </button>
          <button className="btn btn-outline" onClick={() => onNavigate("identify")}>
            Identify another
          </button>
        </div>
      ) : (
        <div className="result-actions reveal-io in" id="resultActionsLow">
          <button className="btn btn-primary" onClick={() => onNavigate("identify")}>
            Try another photo
          </button>
        </div>
      )}

      {/* Dev Toggle for Judges */}
      <div className="dev-toggle">
        <span className="dev-toggle-label">Demo control (judges)</span>
        <button
          className={`dev-btn ${activeMode === "high" ? "active" : ""}`}
          onClick={() => handleToggleMode("high")}
        >
          High confidence
        </button>
        <button
          className={`dev-btn ${activeMode === "low" ? "active" : ""}`}
          onClick={() => handleToggleMode("low")}
        >
          Low confidence
        </button>
      </div>
    </section>
  );
}