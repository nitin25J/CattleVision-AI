import React from "react";
import CattleMascot from "./CattleMascot";

export const STAGES = [
  { id: 1, label: "Detecting animal & isolating subject" },
  { id: 2, label: "Extracting morphological markers & horn profile" },
  { id: 3, label: "Matching with 50+ ICAR-NBAGR breeds" },
  { id: 4, label: "Calibrating confidence & genetic traits" }
];

export default function LoadingSpinner({
  imageSrc,
  progress = 0,
  stepIndex = 0,
  stepFade = false,
  statusMessage = "Analyzing image…",
  isExiting = false,
  onCancel
}) {
  return (
    <div
      className={`analyzing-wrap show ${isExiting ? "exiting" : ""}`}
      id="analyzingWrap"
    >
      {/* Top AI Engine pill */}
      <div className="analyzing-badge-top">
        <span className="scan-live-dot" />
        <span>CattleVision AI · Deep Learning Inference</span>
      </div>

      {/* Main visual scan container */}
      <div className="scan-showcase">
        <div className="scan-frame">
          {imageSrc ? (
            <img id="scanImg" src={imageSrc} alt="Analyzing animal photo" />
          ) : (
            <div className="scan-frame-placeholder">
              <CattleMascot width="80%" height="80%" />
            </div>
          )}

          {/* Viewfinder corner reticles */}
          <span className="scan-corner scan-corner-tl" />
          <span className="scan-corner scan-corner-tr" />
          <span className="scan-corner scan-corner-bl" />
          <span className="scan-corner scan-corner-br" />

          {/* Live scan badge and laser scan beam */}
          <div className="scan-live-badge">
            <span className="scan-live-dot" />
            LIVE AI SCAN
          </div>
          <div className="scan-ring" />
          <div className="scan-line" />
        </div>

        {/* Animated Cow Mascot Companion */}
        <div className="analyzing-cow-badge" title="CattleVision AI Mascot analyzing your photo">
          <CattleMascot width="100%" height="100%" />
        </div>
      </div>

      {/* Spinner + "Analyzing image…" Heading */}
      <div className="analyzing-title-row">
        <div className="analyzing-spinner-ring" />
        <h2 className="analyzing-title">Analyzing image…</h2>
      </div>

      {/* Rotating stage subtitle */}
      <p className={`analyzing-sub ${stepFade ? "step-fade" : ""}`} id="analyzingSub">
        {statusMessage}
      </p>

      {/* Polished progress bar with percentage readout */}
      <div className="progress-container">
        <div className="progress-header">
          <span>Processing model layers</span>
          <span className="progress-pct-num">{Math.round(progress)}%</span>
        </div>
        <div className="progress-track-enhanced">
          <div
            className="progress-fill-enhanced"
            style={{ width: `${Math.min(Math.max(progress, 2), 100)}%` }}
          />
        </div>
      </div>

      {/* Stage milestones */}
      <div className="analyzing-stages">
        {STAGES.map((st, idx) => {
          const isDone = stepIndex > idx || progress >= (idx + 1) * 25;
          const isActive = !isDone && (stepIndex === idx || (progress >= idx * 25 && progress < (idx + 1) * 25));

          return (
            <div
              key={st.id}
              className={`analyzing-stage-item ${
                isDone ? "completed" : isActive ? "active" : "pending"
              }`}
            >
              <div className="stage-icon-wrap">
                {isDone ? (
                  <svg className="stage-icon-check" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : isActive ? (
                  <div className="stage-icon-spinner" />
                ) : (
                  <div className="stage-icon-dot" />
                )}
              </div>
              <span className="stage-label">{st.label}</span>
            </div>
          );
        })}
      </div>

      {/* Cancel button */}
      {onCancel && !isExiting && (
        <button
          type="button"
          className="analyzing-cancel-btn"
          onClick={onCancel}
        >
          Cancel & choose another photo
        </button>
      )}
    </div>
  );
}