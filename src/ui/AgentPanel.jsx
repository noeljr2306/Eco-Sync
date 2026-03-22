import { useEffect } from "react";
import { motion as _motion, AnimatePresence } from "framer-motion";
import { useAgentStore } from "../store/useAgentStore";
import data from "../data/supplyChain.json";

const SEVERITY_COLORS = {
  critical: "#FF6B6B",
  warning: "#FFB347",
  info: "#00aaff",
};

const ACTION_LABELS = {
  REROUTE: "🔀 Reroute",
  REORDER: "📦 Reorder",
  ESCALATE: "🚨 Escalate",
  MONITOR: "👁 Monitor",
};

export function AgentPanel() {
  const {
    alerts,
    pendingActions,
    agentRunning,
    runAgent,
    approveAction,
    dismissAction,
  } = useAgentStore();

  // Auto-run agent on mount
  useEffect(() => {
    runAgent(data.suppliers);
  }, []);

  return (
    <_motion.div
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      style={{
        position: "absolute",
        top: 80,
        left: 20,
        width: 300,
        maxHeight: "70vh",
        overflowY: "auto",
        background: "rgba(10,10,15,0.92)",
        border: "1px solid #2a2a2e",
        borderRadius: 12,
        backdropFilter: "blur(12px)",
        zIndex: 200,
        padding: "16px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#FF6B6B",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Autonomous Agent
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              marginTop: 2,
            }}
          >
            Supply Monitor
          </div>
        </div>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: agentRunning ? "#FFB347" : "#00FF88",
            boxShadow: `0 0 8px ${agentRunning ? "#FFB347" : "#00FF88"}`,
          }}
        />
      </div>

      <div style={{ fontSize: 11, color: "#444", marginBottom: 12 }}>
        {pendingActions.length} actions awaiting approval
      </div>

      {/* Pending Actions */}
      <AnimatePresence>
        {pendingActions.map((alert) => (
          <_motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              background: "#18181c",
              border: `1px solid ${SEVERITY_COLORS[alert.severity]}44`,
              borderLeft: `3px solid ${SEVERITY_COLORS[alert.severity]}`,
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: SEVERITY_COLORS[alert.severity],
                marginBottom: 4,
              }}
            >
              {ACTION_LABELS[alert.action]}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#ccc",
                lineHeight: 1.5,
                marginBottom: 8,
              }}
            >
              {alert.message}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => approveAction(alert.id)}
                style={{
                  flex: 1,
                  background: `${SEVERITY_COLORS[alert.severity]}22`,
                  border: `1px solid ${SEVERITY_COLORS[alert.severity]}55`,
                  borderRadius: 6,
                  padding: "5px 0",
                  color: SEVERITY_COLORS[alert.severity],
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Approve
              </button>
              <button
                onClick={() => dismissAction(alert.id)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "1px solid #2a2a2e",
                  borderRadius: 6,
                  padding: "5px 0",
                  color: "#555",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Dismiss
              </button>
            </div>
          </_motion.div>
        ))}
      </AnimatePresence>

      {pendingActions.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#333",
            fontSize: 12,
            padding: "20px 0",
          }}
        >
          ✓ All actions resolved
        </div>
      )}
    </_motion.div>
  );
}
