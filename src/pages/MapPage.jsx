import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion as _motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Globe } from "../components/Globe";
import { Sidebar } from "../ui/Sidebar";
import { FilterBar } from "../ui/FilterBar";
import { LandingHeader } from "../ui/LandingHeader";
import { Loader } from "../components/Loader";
import { useMapStore } from "../store/useMapStore";

export default function MapPage() {
  const [explored, setExplored] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const selectedNode = useMapStore(s => s.selectedNode);
  const clearSelection = useMapStore(s => s.clearSelection);
  const globeRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Keep dimensions in sync on resize
  useEffect(() => {
    function onResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function handleExplore() {
    // Animate globe wrapper from right-anchored to centered
    gsap.to(wrapperRef.current, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      duration: 1.1,
      ease: "power3.inOut",
      onComplete: () => {
        setExplored(true);
        if (globeRef.current) {
          globeRef.current.controls().autoRotate = true;
          globeRef.current.controls().autoRotateSpeed = 0.6;
        }
      },
    });
  }

  // Globe size — smaller on mobile
  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;
  const globeSize = isMobile ? dimensions.width : isTablet ? dimensions.width * 0.75 : dimensions.height * 1.1;

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      position: "relative",
      background: "#0a0a0f",
      overflow: "hidden",
      fontFamily: "Segoe UI, sans-serif",
    }}>
      <Loader />

      {/* Globe wrapper — starts anchored to right, animates to center */}
      <div
        ref={wrapperRef}
        style={{
          position: "absolute",
          top: "50%",
          // On mobile start centered, on desktop start at right
          left: isMobile ? "50%" : "72%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          transition: "none",
        }}
      >
        <Globe
          ref={globeRef}
          width={globeSize}
          height={globeSize}
        />
      </div>

      {/* Landing overlay */}
      <AnimatePresence>
        {!explored && (
          <_motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
            }}
          >
            <LandingHeader onExplore={handleExplore} isMobile={isMobile} />
          </_motion.div>
        )}
      </AnimatePresence>

      {/* Map UI after explore */}
      <AnimatePresence>
        {explored && (
          <_motion.div
            key="mapui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none" }}
          >
            {/* Everything inside needs its own pointerEvents */}
            <div style={{ pointerEvents: "all" }}>
              <FilterBar />
              <Sidebar />
            </div>

            {/* Analytics button */}
            <_motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate("/analytics")}
              style={{
                position: "absolute",
                top: isMobile ? 12 : 24,
                right: isMobile ? 12 : 24,
                background: "rgba(10,10,15,0.85)",
                border: "1px solid #2a2a2e",
                borderRadius: 8,
                padding: isMobile ? "6px 12px" : "8px 18px",
                color: "#aaa",
                fontSize: isMobile ? 11 : 12,
                fontWeight: 600,
                cursor: "pointer",
                backdropFilter: "blur(12px)",
                letterSpacing: 1,
                pointerEvents: "all",
              }}
            >Analytics →</_motion.button>

            {/* Reset button */}
            {selectedNode && (
              <_motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={clearSelection}
                style={{
                  position: "absolute",
                  bottom: isMobile ? 80 : 90,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(10,10,15,0.85)",
                  border: "1px solid #FF6B6B",
                  color: "#FF6B6B",
                  padding: isMobile ? "8px 18px" : "10px 24px",
                  borderRadius: 8,
                  fontSize: isMobile ? 11 : 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: 1,
                  pointerEvents: "all",
                  whiteSpace: "nowrap",
                }}
              >← RESET VIEW</_motion.button>
            )}
          </_motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}