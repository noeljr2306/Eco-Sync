import { useEffect } from "react";
import { motion as _motion, AnimatePresence } from "framer-motion";
import {
  Repeat,
  Package,
  TriangleAlert,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useAgentStore } from "../store/useAgentStore";
import data from "../data/supplyChain.json";
import { theme } from "../utils/theme";

const SEVERITY_COLORS = {
  critical: theme.color.containerRed,
  warning: theme.color.safetyYellow,
  info: theme.color.industrialBlueLight,
};

const ACTION_META = {
  REROUTE: { label: "Reroute", Icon: Repeat },
  REORDER: { label: "Reorder", Icon: Package },
  ESCALATE: { label: "Escalate", Icon: TriangleAlert },
  MONITOR: { label: "Monitor", Icon: Eye },
};

export function AgentPanel({ isMobile }) {
  const {
    pendingActions,
    agentRunning,
    runAgent,
    approveAction,
    dismissAction,
  } = useAgentStore();

  useEffect(() => {
    runAgent(data.suppliers);
  }, [runAgent]);

  return (
    <_motion.div
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 110, damping: 18 }}
      style={{
        position: "absolute",
        top: isMobile ? "auto" : 80,
        bottom: isMobile ? 20 : "auto",
        left: isMobile ? 10 : 20,
        right: isMobile ? 10 : "auto",
        width: isMobile ? "calc(100% - 20px)" : 300,
        maxHeight: isMobile ? "35vh" : "70vh",
        overflowY: "auto",
        background: theme.color.panel,
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.md,
        zIndex: 200,
        padding: isMobile ? 14 : 16,
        fontFamily: theme.font.family,
        boxShadow: theme.shadow.panel,
      }}
    >
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
              fontSize: 10,
              color: theme.color.textMuted,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Autonomous Agent
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.color.textPrimary,
              marginTop: 2,
            }}
          >
            Supply Monitor
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10,
            color: theme.color.textMuted,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: agentRunning
                ? theme.color.safetyYellow
                : theme.color.emerald,
            }}
          />
          {agentRunning ? "RUNNING" : "IDLE"}
        </div>
      </div>

      <div
        style={{ fontSize: 11, color: theme.color.textMuted, marginBottom: 12 }}
      >
        {pendingActions.length} action{pendingActions.length === 1 ? "" : "s"}{" "}
        awaiting approval
      </div>

      <AnimatePresence>
        {pendingActions.map((alert) => {
          const meta = ACTION_META[alert.action];
          const color = SEVERITY_COLORS[alert.severity];
          return (
            <_motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16 }}
              style={{
                background: theme.color.panelAlt,
                border: `1px solid ${theme.color.border}`,
                borderLeft: `3px solid ${color}`,
                borderRadius: theme.radius.sm,
                padding: "10px 12px",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  color,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                <meta.Icon size={13} strokeWidth={2.25} />
                {meta.label}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: theme.color.textSecondary,
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                {alert.message}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => approveAction(alert.id)}
                  style={{
                    flex: 1,
                    background: theme.color.panel,
                    border: `1px solid ${color}66`,
                    borderRadius: theme.radius.sm,
                    padding: "6px 0",
                    color,
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
                    border: `1px solid ${theme.color.border}`,
                    borderRadius: theme.radius.sm,
                    padding: "6px 0",
                    color: theme.color.textMuted,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  Dismiss
                </button>
              </div>
            </_motion.div>
          );
        })}
      </AnimatePresence>

      {pendingActions.length === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            color: theme.color.textMuted,
            fontSize: 12,
            padding: "20px 0",
          }}
        >
          <CheckCircle2 size={14} />
          All actions resolved
        </div>
      )}
    </_motion.div>
  );
}
