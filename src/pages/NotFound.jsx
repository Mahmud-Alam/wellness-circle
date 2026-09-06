// src/pages/NotFound.jsx
// 404 page — lives inside AuthLayout (phone frame).

import { Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Logo from "../components/layout/Logo";

const FLOATING_EMOJIS = [
  { top: "8%",  left: "72%", content: "🧘", delay: "0s",   size: "1.25rem" },
  { top: "72%", left: "80%", content: "🌿", delay: "0.4s", size: "1rem" },
  { top: "76%", left: "6%",  content: "🏃", delay: "0.8s", size: "1.125rem" },
  { top: "10%", left: "4%",  content: "💨", delay: "1.2s", size: "0.875rem" },
];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="auth-page">
        <div className="auth-page__accent" />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", gap: 0 }}>
          {/* Illustration */}
          <div style={{ position: "relative", marginBottom: "2.5rem", userSelect: "none" }}>
            <div style={{
              position: "absolute", inset: 0, margin: "-2rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ECFDF5, #EFF6FF, #F0FDF4)",
              filter: "blur(2rem)", opacity: 0.8,
            }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "16rem", height: "16rem" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(167,243,208,0.4)", animation: "spin 18s linear infinite" }} />
              <div style={{ position: "absolute", inset: "1rem", borderRadius: "50%", border: "1px solid rgba(191,219,254,0.5)", animation: "spin 12s linear infinite reverse" }} />
              <div style={{ position: "absolute", inset: "2rem", borderRadius: "50%", border: "1px solid rgba(167,243,208,0.3)", animation: "spin 22s linear infinite" }} />

              {/* Centre card */}
              <div style={{
                position: "relative", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                width: "11rem", height: "11rem", borderRadius: "2.5rem",
                backgroundColor: "white",
                boxShadow: "0 8px 40px rgba(16,185,129,0.13), 0 2px 16px rgba(59,130,246,0.08)",
                border: "1px solid #E2E8F0",
              }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.125rem", lineHeight: 1 }}>
                  <span style={{ fontSize: "3.25rem", fontWeight: 900, color: "#10B981", letterSpacing: "-0.05em" }}>4</span>
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "3rem", height: "3.5rem" }}>
                    <svg width="44" height="56" viewBox="0 0 44 56" fill="none">
                      <path d="M22 2C13.163 2 6 9.163 6 18c0 12 16 34 16 34s16-22 16-34C38 9.163 30.837 2 22 2z" fill="#ECFDF5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="22" cy="18" r="6" fill="#10B981" />
                      <circle cx="20" cy="16" r="2" fill="white" fillOpacity="0.5" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "3.25rem", fontWeight: 900, color: "#3B82F6", letterSpacing: "-0.05em" }}>4</span>
                </div>
                <p style={{ fontSize: "0.625rem", fontWeight: 700, color: "#CBD5E1", textTransform: "uppercase", letterSpacing: "0.2em", marginTop: "0.25rem" }}>
                  Not Found
                </p>
              </div>

              {FLOATING_EMOJIS.map(({ top, left, content, delay, size }) => (
                <div
                  key={content}
                  style={{
                    position: "absolute", top, left,
                    fontSize: size,
                    animation: "fadeIn 3s ease-in-out infinite alternate",
                    animationDelay: delay,
                  }}
                >
                  {content}
                </div>
              ))}
            </div>
          </div>

          {/* Copy */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
            <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#1E293B" }}>
              Oops, you're lost.
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#64748B", maxWidth: "16rem" }}>
              This event has wandered off the map!
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
              <div style={{ width: "2rem", height: "1px", backgroundColor: "#A7F3D0" }} />
              <div style={{ width: "0.375rem", height: "0.375rem", borderRadius: "50%", backgroundColor: "#10B981" }} />
              <div style={{ width: "2rem", height: "1px", backgroundColor: "#A7F3D0" }} />
            </div>
            <p style={{ fontSize: "0.75rem", color: "#94A3B8", maxWidth: "15rem" }}>
              The page you're looking for doesn't exist or may have been moved.
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", width: "100%", maxWidth: "17.5rem" }}>
            <button
              className="btn-secondary"
              style={{ width: "100%", borderColor: "#10B981", color: "#10B981", background: "white" }}
              onClick={() => navigate("/discover")}
            >
              <Compass size={17} strokeWidth={2.2} />
              Back to Discover
            </button>
            <button
              className="btn-ghost"
              onClick={() => navigate("/")}
            >
              or go to the home page
            </button>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "3.5rem" }}>
            <Logo size={20} showWordmark={false} />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
