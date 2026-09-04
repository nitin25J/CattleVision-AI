import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

export default function Navbar({ activeScreen, setActiveScreen }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
        </svg>
      )
    },
    {
      id: "identify",
      label: "Identify",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="14" rx="2.5" />
          <circle cx="12" cy="13" r="3.5" />
          <path d="M8 6l1.4-2.2A1 1 0 0 1 10.2 3h3.6a1 1 0 0 1 .8.8L16 6" />
        </svg>
      )
    },
    {
      id: "history",
      label: "History",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      )
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
        </svg>
      )
    }
  ];

  /* close on Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNav = (id) => {
    setActiveScreen(id);
    setOpen(false);
  };

  return (
    <>
      {/* ── Hamburger trigger (always visible top-left) ─────────── */}
      <button
        className={`hamburger-btn${open ? " hamburger-btn--open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ham-bar ham-bar--top" />
        <span className="ham-bar ham-bar--mid" />
        <span className="ham-bar ham-bar--bot" />
      </button>

      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <div
        className={`drawer-backdrop${open ? " drawer-backdrop--visible" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── Slide-out drawer ──────────────────────────────────────── */}
      <aside
        ref={drawerRef}
        className={`sidebar-drawer${open ? " sidebar-drawer--open" : ""}`}
        aria-hidden={!open}
      >
        {/* Brand */}
        <div className="drawer-brand">
          <div className="brand-mark" style={{ overflow: "hidden", background: "#FFFFFF", padding: "2px" }}>
            <img src={logo} alt="CattleVision AI Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <div className="brand-name">CattleVision AI</div>
            <div className="brand-sub">Breed identification</div>
          </div>
        </div>

        {/* Nav links */}
        <ul className="nav-list" role="menu">
          {navItems.map((item, i) => (
            <li key={item.id} role="none" style={{ "--i": i }}>
              <button
                type="button"
                role="menuitem"
                className={`nav-item${activeScreen === item.id ? " active" : ""}`}
                onClick={() => handleNav(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}