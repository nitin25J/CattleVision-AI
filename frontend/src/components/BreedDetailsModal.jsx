import React, { useState, useEffect } from "react";
import { fetchBreedDetail, breedLibrary } from "../services/api";

function AnimalPlaceholderSVG({ color }) {
  return (
    <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="400" height="250" fill={color || "#2E5B41"} />
      <g transform="translate(90,60)">
        <path
          d="M20 90 C10 60 35 35 90 35 L170 35 C210 35 232 62 224 92 L216 130 C212 150 190 165 165 165 L55 165 C32 165 15 148 15 120 Z"
          fill="#ffffff"
          opacity="0.9"
        />
        <ellipse cx="115" cy="80" rx="30" ry="24" fill="#ffffff" opacity="0.9" />
        <circle cx="102" cy="82" r="4" fill={color || "#2E5B41"} />
        <circle cx="128" cy="82" r="4" fill={color || "#2E5B41"} />
      </g>
    </svg>
  );
}

export default function BreedDetailsModal({ breedName, confText, onClose }) {
  const [closing, setClosing] = useState(false);
  const [info, setInfo] = useState(breedLibrary[breedName] || {
    species: "Cattle",
    about: "An indigenous Indian cattle breed recognized by ICAR-NBAGR.",
    characteristics: ["Indigenous breed", "Hardy build", "Heat tolerant"],
    color: "#2E5B41"
  });

  useEffect(() => {
    let isMounted = true;
    fetchBreedDetail(breedName)
      .then((data) => {
        if (isMounted && data) {
          setInfo({
            species: data.species || "Cattle",
            about: data.about || "An indigenous Indian cattle breed recognized by ICAR-NBAGR.",
            characteristics: data.characteristics || ["Indigenous breed", "Hardy build"],
            color: data.color_hex || "#2E5B41"
          });
        }
      })
      .catch(() => {
        // Fallback to initial state
      });
    return () => {
      isMounted = false;
    };
  }, [breedName]);


  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 220);
  };

  return (
    <div
      className={`details-overlay show ${closing ? "closing" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="details-panel">
        <button className="details-close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="details-handle"></div>
        <div className="details-img">
          <AnimalPlaceholderSVG color={info.color} />
        </div>
        <div className="details-species">{info.species}</div>
        <div className="details-name">{breedName}</div>
        <div className="details-block-title">About</div>
        <p className="details-about">{info.about}</p>
        <div className="details-block-title">Characteristics</div>
        <div className="chip-row">
          {info.characteristics.map((c, i) => (
            <span key={i} className="chip">
              {c}
            </span>
          ))}
        </div>
        <div className="details-block-title">Identification confidence</div>
        <div className="details-conf-row">
          <span className="details-conf-num">{confText}</span>
        </div>
      </div>
    </div>
  );
}
