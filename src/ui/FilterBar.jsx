import { useState } from "react";
import { motion as _motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useMapStore } from "../store/useMapStore";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "🟢 Eco", value: "eco" },
  { label: "🟡 Moderate", value: "moderate" },
  { label: "🔴 High", value: "high" },
];

export function FilterBar() {
  const [active, setActive] = useState("all");
  const setActiveFilter = useMapStore((s) => s.setActiveFilter);
  const location = useLocation();

  // Only show on the map page
  if (location.pathname !== "/") return null;

  function handleFilter(value) {
    setActive(value);
    setActiveFilter(value);
  }

  return (
    <_motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      style={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 6,
        background: "rgba(10,10,15,0.85)",
        border: "1px solid #2a2a2e",
        borderRadius: 12,
        padding: "6px 8px",
        backdropFilter: "blur(12px)",
        zIndex: 100,
        whiteSpace: "nowrap",
      }}
    >
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => handleFilter(f.value)}
          style={{
            background: active === f.value ? "#FF6B6B22" : "none",
            border:
              active === f.value
                ? "1px solid #FF6B6B55"
                : "1px solid transparent",
            borderRadius: 8,
            padding: "6px 16px",
            color: active === f.value ? "#FF6B6B" : "#666",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {f.label}
        </button>
      ))}
    </_motion.div>
  );
}
