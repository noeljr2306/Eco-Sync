import { motion as _motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useMapStore } from "../store/useMapStore";
import { theme } from "../utils/theme";

const FILTERS = [
  { label: "All", value: "all", color: theme.color.steel },
  { label: "Eco", value: "eco", color: theme.color.emerald },
  { label: "Moderate", value: "moderate", color: theme.color.safetyYellow },
  { label: "High", value: "high", color: theme.color.containerRed },
];

export function FilterBar({ isMobile }) {
  const active = useMapStore((s) => s.activeFilter ?? "all");
  const setActiveFilter = useMapStore((s) => s.setActiveFilter);
  const location = useLocation();

  if (location.pathname !== "/") return null;

  return (
    <_motion.div
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
      style={{
        position: "absolute",
        bottom: isMobile ? 100 : 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 2,
        background: theme.color.panel,
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.md,
        padding: 4,
        zIndex: 100,
        whiteSpace: "nowrap",
        flexWrap: isMobile ? "wrap" : "nowrap",
        maxWidth: isMobile ? "90vw" : "auto",
        justifyContent: "center",
        boxShadow: theme.shadow.panel,
        fontFamily: theme.font.family,
      }}
    >
      {FILTERS.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => setActiveFilter(f.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: isActive ? theme.color.panelAlt : "transparent",
              border: `1px solid ${isActive ? theme.color.borderStrong : "transparent"}`,
              borderRadius: theme.radius.sm,
              padding: isMobile ? "6px 10px" : "7px 14px",
              color: isActive ? theme.color.textPrimary : theme.color.textMuted,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.03em",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 2,
                background: f.color,
                flexShrink: 0,
              }}
            />
            {f.label}
          </button>
        );
      })}
    </_motion.div>
  );
}
