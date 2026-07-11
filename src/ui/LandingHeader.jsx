import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion as _motion } from "framer-motion";
import gsap from "gsap";
import data from "../data/supplyChain.json";
import { APP_COPY } from "../utils/constants";
import { theme } from "../utils/theme";

export function LandingHeader({ onExplore, isMobile }) {
  const lineRef = useRef(null);
  const navigate = useNavigate();
  const countries = [...new Set(data.suppliers.map((s) => s.country))].length;
  const avgEmission = Math.round(
    data.suppliers.reduce((sum, s) => sum + s.emission, 0) /
      data.suppliers.length,
  );
  const stats = [
    { label: "Suppliers", value: data.suppliers.length },
    { label: "Active Routes", value: data.routes.length },
    { label: "Countries", value: countries },
    { label: "Avg Emission Score", value: `${avgEmission}%` },
  ];

  useEffect(() => {
    gsap.fromTo(
      lineRef.current,
      { width: "0px" },
      { width: "48px", duration: 0.9, delay: 0.8, ease: "power3.out" },
    );
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "flex-start",
        pointerEvents: "none",
        fontFamily: theme.font.family,
      }}
    >
      <_motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 2,
          padding: isMobile ? "40px 24px 48px" : "0 0 0 64px",
          maxWidth: isMobile ? "100%" : 520,
          width: isMobile ? "100%" : "42%",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isMobile
              ? `linear-gradient(to top, ${theme.color.bgDeep} 62%, transparent)`
              : `linear-gradient(to right, ${theme.color.bgDeep} 68%, transparent)`,
            zIndex: -1,
          }}
        />

        {/* Eyebrow */}
        <_motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            letterSpacing: 2.5,
            color: theme.color.industrialBlueLight,
            textTransform: "uppercase",
            marginBottom: 18,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: theme.color.emerald,
              borderRadius: 1,
              display: "inline-block",
            }}
          />
          {APP_COPY.tagline}
        </_motion.div>

        {/* Headline — no gradient text */}
        <_motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            fontSize: isMobile
              ? "clamp(26px, 8vw, 32px)"
              : "clamp(32px, 3vw, 44px)",
            fontWeight: 700,
            color: theme.color.textPrimary,
            lineHeight: 1.2,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Supply chain visibility,
          <br />
          from origin to delivery.
        </_motion.h1>

        <div
          ref={lineRef}
          style={{
            height: 2,
            width: 0,
            background: theme.color.industrialBlue,
            margin: "22px 0",
          }}
        />

        <_motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{
            fontSize: isMobile ? 13 : 14,
            color: theme.color.textSecondary,
            lineHeight: 1.7,
            margin: "0 0 32px",
            maxWidth: 380,
          }}
        >
          {APP_COPY.description}
        </_motion.p>

        {/* CTAs — rectangular, low-key */}
        <_motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            pointerEvents: "all",
          }}
        >
          <button
            type="button"
            onClick={onExplore}
            style={{
              background: theme.color.industrialBlue,
              border: "none",
              borderRadius: theme.radius.md,
              padding: isMobile ? "11px 22px" : "12px 26px",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Explore network →
          </button>

          <button
            type="button"
            onClick={() => navigate("/analytics")}
            style={{
              background: "transparent",
              border: `1px solid ${theme.color.borderStrong}`,
              borderRadius: theme.radius.md,
              padding: isMobile ? "11px 22px" : "12px 26px",
              color: theme.color.textSecondary,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              pointerEvents: "all",
            }}
          >
            View analytics
          </button>
        </_motion.div>

        {/* Stats strip */}
        <_motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
          style={{
            display: "flex",
            gap: isMobile ? 18 : 28,
            marginTop: 44,
            paddingTop: 24,
            borderTop: `1px solid ${theme.color.border}`,
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: isMobile ? 17 : 20,
                  fontWeight: 700,
                  color: theme.color.textPrimary,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: theme.color.textMuted,
                  marginTop: 3,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
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
