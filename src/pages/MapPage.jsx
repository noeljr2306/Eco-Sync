import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion as _motion, AnimatePresence } from "framer-motion";
import { Globe } from "../components/Globe";
import { Sidebar } from "../ui/Sidebar";
import { FilterBar } from "../ui/FilterBar";
import { LandingHeader } from "../ui/LandingHeader";
import { Loader } from "../components/Loader";
import { useMapStore } from "../store/useMapStore";

export default function MapPage() {
  const [explored, setExplored] = useState(false);
  const selectedNode = useMapStore((s) => s.selectedNode);
  const clearSelection = useMapStore((s) => s.clearSelection);
  const globeRef = useRef(null);
  const navigate = useNavigate();

  function handleExplore() {
    setExplored(true);
    // Slowly auto-rotate after hero is dismissed
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.6;
    }
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#0a0a0f",
        overflow: "hidden",
      }}
    >
      <Loader />

      {/* Globe — always rendered in background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Globe ref={globeRef} />
      </div>

      {/* Landing hero — shows until Explore is clicked */}
      <AnimatePresence>
        {!explored && (
          <_motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: "absolute", inset: 0, zIndex: 10 }}
          >
            <LandingHeader onExplore={handleExplore} />
          </_motion.div>
        )}
      </AnimatePresence>

      {/* Map UI — shows after Explore */}
      <AnimatePresence>
        {explored && (
          <_motion.div
            key="mapui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <FilterBar />
            <Sidebar />

            {/* Analytics nav */}
            <button
              onClick={() => navigate("/analytics")}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                background: "rgba(10,10,15,0.85)",
                border: "1px solid #2a2a2e",
                borderRadius: 8,
                padding: "8px 18px",
                color: "#aaa",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                backdropFilter: "blur(12px)",
                letterSpacing: 1,
                zIndex: 100,
              }}
            >
              Analytics →
            </button>

            {selectedNode && (
              <button
                onClick={clearSelection}
                style={{
                  position: "absolute",
                  bottom: 32,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(10,10,15,0.85)",
                  border: "1px solid #FF6B6B",
                  color: "#FF6B6B",
                  padding: "10px 24px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: 1,
                  zIndex: 100,
                }}
              >
                ← RESET VIEW
              </button>
            )}
          </_motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
