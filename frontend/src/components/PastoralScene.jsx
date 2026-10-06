import React, { useState, useEffect, useRef, useCallback } from "react";
import heroArt from "../assets/hero_pastoral_art_v2.jpg";
import cowSnoutChew from "../assets/cow_snout_chew.png";

export default function PastoralScene({ onTriggerScan }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [offsets, setOffsets] = useState({
    bg: { x: 0, y: 0 },
    mid: { x: 0, y: 0 },
    cow: { x: 0, y: 0 },
    fg: { x: 0, y: 0 },
  });

  // Respect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // 60fps Micro-Parallax via requestAnimationFrame
  const handleMouseMove = useCallback(
    (e) => {
      if (prefersReducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setOffsets({
          bg: { x: nx * 3, y: ny * 2 },
          mid: { x: nx * 6, y: ny * 4 },
          cow: { x: nx * 9, y: ny * 6 },
          fg: { x: nx * 14, y: ny * 8 },
        });
      });
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setOffsets({
      bg: { x: 0, y: 0 },
      mid: { x: 0, y: 0 },
      cow: { x: 0, y: 0 },
      fg: { x: 0, y: 0 },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onTriggerScan}
      role="button"
      tabIndex={0}
      title="Click to identify cattle breed"
      className="relative w-full h-full overflow-hidden select-none bg-[#163A2A] cursor-pointer group rounded-3xl"
    >
      {/* ── Vector Coordinate Stage (Locked to 1376 x 768 native artwork coordinate system) ── */}
      <svg
        viewBox="0 0 1376 768"
        preserveAspectRatio="xMaxYMin slice"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01] rounded-3xl"
        style={{ objectPosition: "right top" }}
      >
        <defs>
          {/* Soft Radial Sun Glow Corona */}
          <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          {/* Shimmering Sun Ray Beam Gradient */}
          <linearGradient id="sunRayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#FDE047" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>

          {/* Soft Drop Shadow for Windmill Rotor */}
          <filter id="rotorShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ── LAYER 0: BASE ARTWORK (Lazy Loaded, 1376x768) ──────────────────── */}
        <image
          href={heroArt}
          x="0"
          y="0"
          width="1376"
          height="768"
          preserveAspectRatio="none"
          loading="lazy"
          decoding="async"
          className="anim-hero-entrance anim-stagger-1"
        />

        {/* ── LAYER 1: DEEP BACKGROUND (Sky, Clouds, Sun Rays) ──────────────── */}
        <g
          style={{
            transform: `translate(${offsets.bg.x}px, ${offsets.bg.y}px)`,
            transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1)",
          }}
          className="pointer-events-none anim-hero-entrance anim-stagger-1"
        >
          {/* Seamless Storybook Cloud 1 (Upper altitude, gentle drift) */}
          <g className="anim-cloud-drift-1" opacity="0.85">
            <path
              d="M 0 70 Q 20 40 50 50 Q 75 25 110 40 Q 140 30 160 55 Q 185 65 175 90 Q 155 105 120 100 Q 80 105 40 100 Q 10 95 0 70 Z"
              fill="#FFFFFF"
              stroke="#D4E4EC"
              strokeWidth="1.5"
            />
          </g>

          {/* Seamless Storybook Cloud 2 (Mid altitude, slower drift) */}
          <g className="anim-cloud-drift-2" opacity="0.75">
            <path
              d="M 0 115 Q 25 90 60 98 Q 90 75 130 92 Q 165 80 190 108 Q 215 120 205 145 Q 180 160 140 152 Q 95 158 50 152 Q 15 145 0 115 Z"
              fill="#FFFFFF"
              stroke="#D4E4EC"
              strokeWidth="1.5"
            />
          </g>

          {/* SUN: Continuous 40s Linear Rotation of Rays + Scale Pulse on Face */}
          <g transform="translate(695, 149)">
            {/* Soft Golden Sunshine Corona Scale Pulse */}
            <circle
              cx="0"
              cy="0"
              r="140"
              fill="url(#sunGlowGrad)"
              className="anim-sun-pulse-subtle"
            />

            {/* 40s Linear Continuous Loop of Radiating Sunshine Rays */}
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="40s"
                repeatCount="indefinite"
              />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                (angle) => (
                  <g key={angle} transform={`rotate(${angle})`}>
                    <polygon
                      points="0,85 -8,168 8,168"
                      fill="url(#sunRayGrad)"
                      opacity="0.45"
                    />
                  </g>
                )
              )}
            </g>

            {/* Sun Face Warmth Pulse */}
            <circle
              cx="0"
              cy="0"
              r="76"
              fill="rgba(254, 240, 138, 0.22)"
              className="anim-sun-pulse-subtle"
            />
          </g>
        </g>

        {/* ── LAYER 2: MIDGROUND (Tree Tops & Repositioned Windmill) ────────── */}
        <g
          style={{
            transform: `translate(${offsets.mid.x}px, ${offsets.mid.y}px)`,
            transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1)",
          }}
          className="pointer-events-none anim-hero-entrance anim-stagger-2"
        >
          {/* Tree Tops Subtle Sway (Only the tops of background trees) */}
          <g
            transform="translate(195, 435)"
            className="anim-tree-sway"
            style={{ transformOrigin: "0px 0px" }}
          >
            {/* Soft pine / foliage sway accents that blend into tree canopy */}
            <path
              d="M-8,-25 Q0,-42 8,-25 Q18,-15 12,0 Q-12,0 -8,-25 Z"
              fill="rgba(56, 102, 65, 0.35)"
            />
          </g>
          <g
            transform="translate(135, 450)"
            className="anim-tree-sway"
            style={{ transformOrigin: "0px 0px", animationDelay: "-2.5s" }}
          >
            <path
              d="M-10,-28 Q0,-46 10,-28 Q20,-16 14,0 Q-14,0 -10,-28 Z"
              fill="rgba(45, 85, 54, 0.35)"
            />
          </g>

          {/* WINDMILL: Centered directly on the windmill tower hub at (1058, 248) */}
          <g transform="translate(1058, 248)" filter="url(#rotorShadow)">
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="8s"
                repeatCount="indefinite"
              />

              {/* 4 Clearly Separated Wooden Lattice Blades */}
              {[0, 90, 180, 270].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  {/* Main Timber Spar */}
                  <line
                    x1="0"
                    y1="0"
                    x2="72"
                    y2="0"
                    stroke="#3E1E0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Outer Wooden Sail Frame */}
                  <rect
                    x="12"
                    y="-8"
                    width="58"
                    height="16"
                    rx="1.5"
                    fill="rgba(248, 240, 222, 0.7)"
                    stroke="#4A260F"
                    strokeWidth="1.8"
                  />

                  {/* Lattice Crossbars (Rungs) */}
                  {[23, 34, 45, 56, 67].map((rx) => (
                    <line
                      key={rx}
                      x1={rx}
                      y1="-8"
                      x2={rx}
                      y2="8"
                      stroke="#5C3114"
                      strokeWidth="1.4"
                    />
                  ))}

                  {/* Longitudinal Center Slat */}
                  <line
                    x1="12"
                    y1="0"
                    x2="70"
                    y2="0"
                    stroke="#3E1E0B"
                    strokeWidth="1.6"
                  />
                </g>
              ))}

              {/* Central Axle Hub Cap mounted on tower */}
              <circle
                cx="0"
                cy="0"
                r="8.5"
                fill="#321A0C"
                stroke="#1C0D05"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="0" r="4.8" fill="#A35F2B" />
              <circle cx="-1.5" cy="-1.5" r="1.8" fill="#F4C78B" opacity="0.9" />
            </g>
          </g>
        </g>

        {/* ── LAYER 3: SUBJECT (Dairy Cow Breathing, Chewing, Tail & Ear) ───── */}
        <g
          style={{
            transform: `translate(${offsets.cow.x}px, ${offsets.cow.y}px)`,
            transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1)",
          }}
          className="pointer-events-none anim-hero-entrance anim-stagger-3"
        >
          {/* Cow Body Slow Breathing (Gentle scale expansion 1 -> 1.01) */}
          <g className="anim-cow-breathe">
            {/* Cow Tail Swish (Anchored at tail base 390, 470) */}
            <g
              transform="translate(390, 470)"
              className="anim-cow-tail-swish"
              style={{ transformOrigin: "0px 0px" }}
            >
              {/* Subtle animated tail overlay that complements the painted artwork */}
              <path
                d="M 0 0 Q -5 45 -12 85 Q -14 96 -11 106 Q -7 98 -4 86 Q 0 45 0 0 Z"
                fill="#F7F3E9"
                stroke="#2B1A0F"
                strokeWidth="1.4"
              />
              {/* Fluffy Black Tail Brush Tip */}
              <path
                d="M -13 90 Q -24 105 -16 122 Q -7 114 -11 90 Z"
                fill="#24170F"
                stroke="#1B1008"
                strokeWidth="1.2"
              />
            </g>

            {/* Cow Ear Flick (Occasional quick twitch at 805, 335) */}
            <g
              transform="translate(805, 335)"
              className="anim-cow-ear-flick"
              style={{ transformOrigin: "0px 0px" }}
            >
              <ellipse
                cx="0"
                cy="0"
                rx="14"
                ry="8"
                transform="rotate(-25)"
                fill="#F7F3E9"
                stroke="#2A1B0F"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <ellipse
                cx="0"
                cy="0"
                rx="10"
                ry="5"
                transform="rotate(-25)"
                fill="#E89B9B"
                opacity="0.75"
              />
            </g>

            {/* Head Chewing & Muzzle with Grass Mouthful */}
            <g transform="translate(720, 395)">
              <g className="anim-cow-chew" style={{ transformOrigin: "45px 35px" }}>
                {/* Transparent Snout & Mouthful of Grass */}
                <image
                  href={cowSnoutChew}
                  x="0"
                  y="0"
                  width="150"
                  height="115"
                  loading="lazy"
                  decoding="async"
                />
              </g>
            </g>

            {/* Gentle Cow Eye Blink (Aligned precisely on smiling eye arc) */}
            <g transform="translate(726, 375)">
              <path
                d="M 0 6 Q 9 0 18 6"
                fill="none"
                stroke="#261A12"
                strokeWidth="3.2"
                strokeLinecap="round"
              >
                <animate
                  attributeName="d"
                  values="M 0 6 Q 9 0 18 6; M 0 6 Q 9 0 18 6; M 0 6 L 18 6; M 0 6 Q 9 0 18 6"
                  keyTimes="0; 0.88; 0.92; 1"
                  dur="6.5s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>
        </g>

        {/* ── LAYER 4: FOREGROUND (Grass & Wildflowers Wind Sway) ────────────── */}
        <g
          style={{
            transform: `translate(${offsets.fg.x}px, ${offsets.fg.y}px)`,
            transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1)",
          }}
          className="pointer-events-none anim-hero-entrance anim-stagger-4"
        >
          {/* Staggered Foreground Grass Tufts (Swaying in gentle breeze) */}
          {/* Left Grass Clump 1 */}
          <g
            transform="translate(95, 715)"
            className="anim-grass-sway-1"
            style={{ transformOrigin: "0px 0px" }}
          >
            <path
              d="M0,0 Q-15,-40 -25,-75 Q-15,-45 4,0 Z"
              fill="#569E32"
              stroke="#2B5A15"
              strokeWidth="1.2"
            />
            <path
              d="M10,0 Q6,-50 0,-92 Q14,-50 16,0 Z"
              fill="#68B43D"
              stroke="#2B5A15"
              strokeWidth="1.2"
            />
          </g>

          {/* Left Grass Clump 2 + Yellow Flower */}
          <g
            transform="translate(185, 730)"
            className="anim-grass-sway-2"
            style={{ transformOrigin: "0px 0px" }}
          >
            <path
              d="M0,0 Q12,-38 22,-68 Q8,-40 2,0 Z"
              fill="#4E912B"
              stroke="#265213"
              strokeWidth="1.2"
            />
            {/* Little Buttercup Flower */}
            <circle cx="22" cy="-68" r="4.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.8" />
            <circle cx="22" cy="-68" r="2" fill="#EA580C" />
          </g>

          {/* Center-Right Grass Clump 3 + Coral Flower */}
          <g
            transform="translate(920, 725)"
            className="anim-grass-sway-3"
            style={{ transformOrigin: "0px 0px" }}
          >
            <path
              d="M0,0 Q-8,-45 -14,-82 Q-2,-45 6,0 Z"
              fill="#5EA836"
              stroke="#2E6218"
              strokeWidth="1.2"
            />
            <path
              d="M12,0 Q24,-36 34,-66 Q18,-38 14,0 Z"
              fill="#498528"
              stroke="#265213"
              strokeWidth="1.2"
            />
            {/* Little Coral Flower */}
            <circle cx="34" cy="-66" r="4.5" fill="#FB7185" stroke="#BE123C" strokeWidth="0.8" />
            <circle cx="34" cy="-66" r="2" fill="#FDE047" />
          </g>

          {/* Far Right Grass Clump 4 */}
          <g
            transform="translate(1220, 720)"
            className="anim-grass-sway-1"
            style={{ transformOrigin: "0px 0px" }}
          >
            <path
              d="M0,0 Q-18,-42 -28,-80 Q-12,-46 4,0 Z"
              fill="#4D8F2A"
              stroke="#255112"
              strokeWidth="1.2"
            />
            <path
              d="M16,0 Q8,-52 0,-95 Q18,-52 20,0 Z"
              fill="#62AD3A"
              stroke="#2E6218"
              strokeWidth="1.2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
