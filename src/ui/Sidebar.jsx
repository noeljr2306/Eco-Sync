import { useEffect, useRef } from "react";
import { motion as _motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import gsap from "gsap";
import { useMapStore } from "../store/useMapStore";
import { LEVEL_COLORS, LEVEL_LABELS } from "../utils/constants";
import { theme } from "../utils/theme";

function EmissionBar({ value, color }) {
  const barRef = useRef();
  const countRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      barRef.current,
      { width: "0%" },
      { width: `${value}%`, duration: 1.1, ease: "power3.out", delay: 0.2 },
    );
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.1,
      ease: "power3.out",
      delay: 0.2,
      onUpdate: () => {
        if (countRef.current)
          countRef.current.textContent = Math.round(obj.val) + "%";
      },
    });
  }, [value]);

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 11, color: theme.color.textMuted }}>
          CO₂ Emission Score
        </span>
        <span
          ref={countRef}
          style={{
            fontSize: 11,
            color,
            fontWeight: 700,
            fontFamily: theme.font.mono,
          }}
        >
          0%
        </span>
      </div>
      <div
        style={{
          background: theme.color.panelAlt,
          borderRadius: 2,
          height: 5,
          overflow: "hidden",
        }}
      >
        <div
          ref={barRef}
          style={{ height: "100%", width: "0%", background: color }}
        />
      </div>
    </div>
  );
}

export function Sidebar({ isMobile }) {
  const selectedNode = useMapStore((s) => s.selectedNode);
  const clearSelection = useMapStore((s) => s.clearSelection);
  const color = selectedNode
    ? LEVEL_COLORS[selectedNode.level]
    : theme.color.textPrimary;

  return (
    <AnimatePresence>
      {selectedNode && (
        <_motion.div
          key={selectedNode.id}
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: "spring", stiffness: 130, damping: 22 }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: isMobile ? "100%" : 320,
            maxWidth: isMobile ? "100%" : "50vw",
            height: "100vh",
            background: theme.color.panel,
            borderLeft: `1px solid ${theme.color.border}`,
            padding: isMobile ? "20px 16px" : "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            overflowY: "auto",
            zIndex: 100,
            fontFamily: theme.font.family,
          }}
        >
          <button
            onClick={clearSelection}
            style={{
              alignSelf: "flex-end",
              background: "none",
              border: `1px solid ${theme.color.border}`,
              color: theme.color.textMuted,
              width: 28,
              height: 28,
              borderRadius: theme.radius.sm,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: theme.color.panelAlt,
                border: `1px solid ${color}55`,
                borderRadius: theme.radius.sm,
                padding: "4px 10px",
                fontSize: 10,
                color,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 1,
                  background: color,
                }}
              />
              {LEVEL_LABELS[selectedNode.level]}
            </div>
            <h2
              style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                color: theme.color.textPrimary,
                margin: 0,
              }}
            >
              {selectedNode.name}
            </h2>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 13,
                color: theme.color.textMuted,
                marginTop: 6,
              }}
            >
              <MapPin size={12} />
              {selectedNode.city}, {selectedNode.country}
            </p>
          </div>

          <div style={{ height: 1, background: theme.color.border }} />

          <EmissionBar value={selectedNode.emission} color={color} />

          <div style={{ height: 1, background: theme.color.border }} />

          <div>
            <div
              style={{
                fontSize: 10.5,
                color: theme.color.textMuted,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              Products
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {selectedNode.products.map((p) => (
                <span
                  key={p}
                  style={{
                    background: theme.color.panelAlt,
                    border: `1px solid ${theme.color.border}`,
                    borderRadius: theme.radius.sm,
                    padding: "5px 10px",
                    fontSize: 12,
                    color: theme.color.textSecondary,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: theme.color.border }} />

          <div>
            <div
              style={{
                fontSize: 10.5,
                color: theme.color.textMuted,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 12,
                fontWeight: 600,
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
                    background: theme.color.panelAlt,
                    borderRadius: theme.radius.sm,
                    padding: "10px 12px",
                    border: `1px solid ${theme.color.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: theme.color.textMuted,
                      marginBottom: 4,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.color.textSecondary,
                      fontWeight: 600,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {selectedNode.dpp && (
              <>
                <div
                  style={{
                    height: 1,
                    background: theme.color.border,
                    margin: "16px 0",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: theme.color.textMuted,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      marginBottom: 10,
                      fontWeight: 600,
                    }}
                  >
                    EU Digital Product Passport
                  </div>
                  <div
                    style={{
                      background: theme.color.panelAlt,
                      border: `1px solid ${theme.color.border}`,
                      borderRadius: theme.radius.sm,
                      padding: "12px 14px",
                      fontSize: 11,
                      lineHeight: 2,
                    }}
                  >
                    {[
                      [
                        "Passport ID",
                        selectedNode.dpp.passport_id,
                        theme.font.mono,
                      ],
                      ["Regulation", selectedNode.dpp.regulation],
                    ].map(([label, val, font]) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: theme.color.textMuted }}>
                          {label}
                        </span>
                        <span
                          style={{
                            color: theme.color.textSecondary,
                            fontFamily: font,
                            fontSize: font ? 10 : 11,
                          }}
                        >
                          {val}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: theme.color.textMuted }}>
                        Scope 3
                      </span>
                      <span
                        style={{
                          color: theme.color.safetyYellow,
                          fontWeight: 600,
                        }}
                      >
                        {selectedNode.dpp.scope3_kg_co2e_per_unit} kg CO₂e/unit
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: theme.color.textMuted }}>CBAM</span>
                      <span
                        style={{
                          color: selectedNode.dpp.carbon_border_adjustment
                            ? theme.color.containerRed
                            : theme.color.emerald,
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
                            background: `${theme.color.emerald}18`,
                            border: `1px solid ${theme.color.emerald}44`,
                            borderRadius: theme.radius.sm,
                            padding: "2px 8px",
                            color: theme.color.emerald,
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

          <button
            style={{
              marginTop: "auto",
              background: theme.color.industrialBlue,
              border: "none",
              borderRadius: theme.radius.md,
              padding: "12px",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            View full profile →
          </button>
        </_motion.div>
      )}
    </AnimatePresence>
  );
}
