import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../services/api";

export default function Dashboard() {
  const [profile, setProfile] = useState({
    name: "Field Worker",
    role: "Livestock data collector",
    identifications_count: 0,
    avg_confidence: 0
  });

  useEffect(() => {
    fetchUserProfile()
      .then((data) => {
        if (data) {
          setProfile({
            name: data.name || "Field Worker",
            role: data.role === "field_worker" ? "Livestock data collector" : data.role,
            identifications_count: data.identifications_count || 0,
            avg_confidence: Math.round(data.avg_confidence || 0)
          });
        }
      })
      .catch(() => {
        // Keep initial fallback state if offline
      });
  }, []);

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "FW";

  return (
    <section className="screen active" id="screen-profile">
      <p className="eyebrow">Profile</p>
      <h1 className="page-title">Your profile</h1>
      <p className="page-subtitle">Demo account details.</p>

      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-name">{profile.name}</div>
        <div className="profile-role">{profile.role}</div>
        <div className="profile-meta-line">
          <span>Identifications</span>
          <b>{profile.identifications_count}</b>
        </div>
        <div className="profile-meta-line">
          <span>Avg. confidence</span>
          <b>{profile.avg_confidence}%</b>
        </div>
        <div className="profile-meta-line">
          <span>App version</span>
          <b>Prototype 1.0 (PyTorch MVP)</b>
        </div>
      </div>
    </section>
  );
}