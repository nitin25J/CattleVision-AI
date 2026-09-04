import React from "react";

export default function CattleMascot({ className = "cattle-illustration", width = "100%", height = "100%", style = {} }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      fill="none"
      style={{ width, height, ...style }}
    >
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
  );
}
