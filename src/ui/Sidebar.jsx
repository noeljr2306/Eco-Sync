import { useEffect, useRef } from "react";
import { motion as _motion, AnimatePresence } from "framer-motion";
import { useMapStore } from "../store/useMapStore";
import gsap from "gsap";

const LEVEL_COLORS = {
  eco: "#00FF88",
  moderate: "#FFB347",
  high: "#FF6B6B",
};

const LEVEL_LABELS = {
  eco: "Eco Friendly",
  moderate: "Moderate",
  high: "High Emission",
};

function EmissionBar({ value, color }) {
  const barRef = useRef();
  const countRef = useRef();

  useEffect(() => {
    // Animate the bar width
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      { width: `${value}%`, duration: 1.2, ease: "power3.out", delay: 0.3 },
    );

    // Animate the counter number
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.3,
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = Math.round(obj.val) + "%";
        }
      },
    });
  }, [value]);

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 11, color: "#666" }}>CO₂ Emission Score</span>
        <span ref={countRef} style={{ fontSize: 11, color, fontWeight: 700 }}>
          0%
        </span>
      </div>
      <div
        style={{
          background: "#1a1a1f",
          borderRadius: 4,
          height: 6,
          overflow: "hidden",
        }}
      >
        <div
          ref={barRef}
          style={{
            height: "100%",
            width: "0%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}

export function Sidebar() {
  const selectedNode = useMapStore((s) => s.selectedNode);
  const clearSelection = useMapStore((s) => s.clearSelection);

  const color = selectedNode ? LEVEL_COLORS[selectedNode.level] : "#fff";

  return (
    <AnimatePresence>
      {selectedNode && (
        <_motion.div
          key={selectedNode.id}
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 320,
            height: "100vh",
            background: "rgba(10,10,15,0.92)",
            borderLeft: `1px solid ${color}33`,
            backdropFilter: "blur(12px)",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            overflowY: "auto",
            zIndex: 100,
          }}
        >
          {/* Close button */}
          <button
            onClick={clearSelection}
            style={{
              alignSelf: "flex-end",
              background: "none",
              border: "1px solid #333",
              color: "#666",
              width: 28,
              height: 28,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            ×
          </button>

          {/* Header */}
          <div>
            <div
              style={{
                display: "inline-block",
                background: `${color}22`,
                border: `1px solid ${color}55`,
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 10,
                color,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              {LEVEL_LABELS[selectedNode.level]}
            </div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              {selectedNode.name}
            </h2>
            <p style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
              {selectedNode.city}, {selectedNode.country}
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#1e1e24" }} />

          {/* Emission bar */}
          <EmissionBar value={selectedNode.emission} color={color} />

          {/* Divider */}
          <div style={{ height: 1, background: "#1e1e24" }} />

          {/* Products */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#555",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Products
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {selectedNode.products.map((p) => (
                <span
                  key={p}
                  style={{
                    background: "#18181c",
                    border: "1px solid #2a2a2e",
                    borderRadius: 6,
                    padding: "5px 10px",
                    fontSize: 12,
                    color: "#ccc",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#1e1e24" }} />

          {/* Stats */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#555",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Quick Stats
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                { label: "Routes", value: "Active" },
                { label: "Region", value: selectedNode.country },
                { label: "Score", value: `${selectedNode.emission}/100` },
                { label: "Status", value: LEVEL_LABELS[selectedNode.level] },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#18181c",
                    borderRadius: 8,
                    padding: "10px 12px",
                    border: "1px solid #2a2a2e",
                  }}
                >
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#ccc", fontWeight: 600 }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
            {selectedNode.dpp && (
              <>
                <div style={{ height: 1, background: "#1e1e24" }} />
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#555",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    EU Digital Product Passport
                  </div>
                  <div
                    style={{
                      background: "#0d0d0f",
                      borderRadius: 8,
                      padding: "12px 14px",
                      fontSize: 11,
                      lineHeight: 2,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#555" }}>Passport ID</span>
                      <span
                        style={{
                          color: "#aaa",
                          fontFamily: "monospace",
                          fontSize: 10,
                        }}
                      >
                        {selectedNode.dpp.passport_id}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#555" }}>Regulation</span>
                      <span style={{ color: "#aaa" }}>
                        {selectedNode.dpp.regulation}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#555" }}>Scope 3</span>
                      <span style={{ color: "#FFB347", fontWeight: 600 }}>
                        {selectedNode.dpp.scope3_kg_co2e_per_unit} kg CO₂e/unit
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#555" }}>CBAM</span>
                      <span
                        style={{
                          color: selectedNode.dpp.carbon_border_adjustment
                            ? "#FF6B6B"
                            : "#00FF88",
                        }}
                      >
                        {selectedNode.dpp.carbon_border_adjustment
                          ? "Applicable"
                          : "Exempt"}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      {selectedNode.dpp.certifications.map((c) => (
                        <span
                          key={c}
                          style={{
                            background: "#00FF8811",
                            border: "1px solid #00FF8833",
                            borderRadius: 4,
                            padding: "2px 8px",
                            color: "#00FF88",
                            fontSize: 10,
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* View Full Profile button */}
          <_motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              marginTop: "auto",
              background: `linear-gradient(135deg, ${color}22, ${color}11)`,
              border: `1px solid ${color}55`,
              borderRadius: 8,
              padding: "12px",
              color,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: 0.5,
            }}
          >
            View Full Profile →
          </_motion.button>
        </_motion.div>
      )}
    </AnimatePresence>
  );
}
