import { useEffect, useRef } from "react";
import { motion as _motion } from "framer-motion";
import gsap from "gsap";

export function LandingHeader({ onExplore }) {
  const lineRef = useRef(null);

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
        zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {/* LEFT — hero text panel */}
      <_motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          padding: "60px 48px 60px 60px",
          background:
            "linear-gradient(to right, rgba(10,10,15,0.97) 70%, transparent)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
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

        <_motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 800,
            color: "#ffffff",
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

        {/* Animated underline */}
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

        <_motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            fontSize: 14,
            color: "#666",
            lineHeight: 1.8,
            margin: "0 0 36px",
            maxWidth: 360,
          }}
        >
          Visualize supplier networks, emission levels, and logistics routes
          across the globe in real time.
        </_motion.p>

        {/* CTAs */}
        <_motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", gap: 12, pointerEvents: "all" }}
        >
          <button
            onClick={onExplore}
            style={{
              background: "linear-gradient(135deg, #FF6B6B, #ff4444)",
              border: "none",
              borderRadius: 8,
              padding: "13px 30px",
              color: "#fff",
              fontSize: 13,
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
              padding: "13px 30px",
              color: "#FF6B6B",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              pointerEvents: "all",
            }}
          >
            View Analytics
          </button>
        </_motion.div>

        {/* Bottom stats */}
        <_motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            display: "flex",
            gap: 32,
            marginTop: 48,
          }}
        >
          {[
            { label: "Suppliers", value: "8" },
            { label: "Active Routes", value: "8" },
            { label: "Countries", value: "8" },
            { label: "Avg Emission", value: "40%" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
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

      {/* RIGHT — intentionally empty so globe shows through */}
      <div style={{ height: "100%" }} />
    </div>
  );
}
