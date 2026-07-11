import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion as _motion, AnimatePresence } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Globe } from "../components/Globe";
import { Sidebar } from "../ui/Sidebar";
import { FilterBar } from "../ui/FilterBar";
import { LandingHeader } from "../ui/LandingHeader";
import { Loader } from "../components/Loader";
import { useMapStore } from "../store/useMapStore";
import { AgentPanel } from "../ui/AgentPanel";
import { theme } from "../utils/theme";

export default function MapPage() {
  const [explored, setExplored] = useState(false);
  const selectedNode = useMapStore((s) => s.selectedNode);
  const clearSelection = useMapStore((s) => s.clearSelection);
  const globeRef = useRef(null);
  const navigate = useNavigate();

  function handleExplore() {
    setExplored(true);
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: theme.color.bgDeep,
        overflow: "hidden",
      }}
    >
      <Loader />

      <_motion.div
        animate={
          explored
            ? { x: "0%", scale: 1 }
            : {
                x:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "0%"
                    : "28%",
                scale:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? 0.85
                    : 1,
              }
        }
        initial={
          typeof window !== "undefined" && window.innerWidth < 768
            ? { x: "0%", scale: 0.85 }
            : { x: "28%", scale: 1 }
        }
        transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Globe ref={globeRef} />
      </_motion.div>

      <AnimatePresence>
        {!explored && (
          <_motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{ position: "absolute", inset: 0, zIndex: 10 }}
          >
            <LandingHeader onExplore={handleExplore} />
          </_motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {explored && (
          <_motion.div
            key="mapui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FilterBar />
            <Sidebar />
            <AgentPanel />
            <button
              onClick={() => navigate("/analytics")}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: theme.color.panel,
                border: `1px solid ${theme.color.border}`,
                borderRadius: theme.radius.md,
                padding: "9px 18px",
                color: theme.color.textSecondary,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.03em",
                zIndex: 100,
                fontFamily: theme.font.family,
              }}
            >
              <BarChart3 size={14} />
              Analytics
            </button>

            {selectedNode && (
              <button
                onClick={clearSelection}
                style={{
                  position: "absolute",
                  bottom: 32,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: theme.color.panel,
                  border: `1px solid ${theme.color.industrialBlue}`,
                  color: theme.color.industrialBlueLight,
                  padding: "10px 22px",
                  borderRadius: theme.radius.md,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  zIndex: 100,
                  fontFamily: theme.font.family,
                }}
              >
                ← Reset view
              </button>
            )}
          </_motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
