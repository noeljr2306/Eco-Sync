import { useEffect, useRef } from "react";
import { motion as _motion } from "framer-motion";
import gsap from "gsap";
import data from "../data/supplyChain.json";

export function LandingHeader({ onExplore, isMobile }) {
  const lineRef = useRef(null);
  const countries = [...new Set(data.suppliers.map((s) => s.country))].length;
  const avgEmission = Math.round(
    data.suppliers.reduce((sum, s) => sum + s.emission, 0) /
      data.suppliers.length,
  );
  const stats = [
    { label: "Suppliers", value: data.suppliers.length },
    { label: "Active Routes", value: data.routes.length },
    { label: "Countries", value: countries },
    { label: "Avg Emission", value: `${avgEmission}%` },
  ];
  useEffect(() => {
    gsap.fromTo(
      lineRef.current,
      { width: "0px" },
      { width: "60px", duration: 1, delay: 1, ease: "power3.out" },
    );
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        // On mobile stack vertically at bottom, on desktop left-align
        justifyContent: "flex-start",
        pointerEvents: "none",
      }}
    >
      {/* Gradient backdrop only behind text */}
      <_motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 2,
          padding: isMobile ? "40px 28px" : "0 0 0 60px",
          maxWidth: isMobile ? "100%" : 520,
          width: isMobile ? "100%" : "45%",
          pointerEvents: "none",
        }}
      >
        {/* Gradient that fades right so globe shows */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isMobile
              ? "linear-gradient(to top, rgba(10,10,15,0.98) 60%, transparent)"
              : "linear-gradient(to right, rgba(10,10,15,0.97) 75%, transparent)",
            zIndex: -1,
            borderRadius: 0,
          }}
        />

        {/* Tag line */}
        <_motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: 11,
            letterSpacing: 4,
            color: "#FF6B6B",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Global Supply Intelligence
        </_motion.div>

        {/* Headline */}
        <_motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: isMobile
              ? "clamp(28px, 8vw, 36px)"
              : "clamp(36px, 4vw, 56px)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          Track Your
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #FF6B6B, #FFB347)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Supply Route
          </span>
          <br />
          On Earth.
        </_motion.h1>

        {/* Underline */}
        <div
          ref={lineRef}
          style={{
            height: 2,
            width: 0,
            background: "linear-gradient(90deg, #FF6B6B, transparent)",
            borderRadius: 2,
            margin: "20px 0",
          }}
        />

        {/* Description */}
        <_motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            fontSize: isMobile ? 13 : 14,
            color: "#666",
            lineHeight: 1.8,
            margin: "0 0 32px",
            maxWidth: 380,
          }}
        >
          Visualize supplier networks, emission levels, and logistics routes
          across the globe in real time.
        </_motion.p>

        {/* CTA buttons */}
        <_motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            pointerEvents: "all",
          }}
        >
          <button
            onClick={onExplore}
            style={{
              background: "linear-gradient(135deg, #FF6B6B, #ff4444)",
              border: "none",
              borderRadius: 8,
              padding: isMobile ? "11px 24px" : "13px 30px",
              color: "#fff",
              fontSize: isMobile ? 12 : 13,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: 0.5,
              boxShadow: "0 0 24px #FF6B6B55",
            }}
          >
            Explore Globe →
          </button>

          <button
            onClick={() => (window.location.href = "/analytics")}
            style={{
              background: "rgba(255,107,107,0.08)",
              border: "1px solid #FF6B6B44",
              borderRadius: 8,
              padding: isMobile ? "11px 24px" : "13px 30px",
              color: "#FF6B6B",
              fontSize: isMobile ? 12 : 13,
              fontWeight: 600,
              cursor: "pointer",
              pointerEvents: "all",
            }}
          >
            View Analytics
          </button>
        </_motion.div>

        {/* Stats row */}
        <_motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            display: "flex",
            gap: isMobile ? 20 : 32,
            marginTop: 40,
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: isMobile ? 18 : 22,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#444",
                  marginTop: 2,
                  letterSpacing: 1,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </_motion.div>
      </_motion.div>
    </div>
  );
}
