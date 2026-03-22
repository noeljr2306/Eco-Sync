import { create } from "zustand";

const RULES = [
  {
    id: "rule_high_risk",
    condition: (s) => s.telemetry?.riskScore > 80,
    severity: "critical",
    action: "REROUTE",
    message: (s) =>
      `${s.name} risk score ${s.telemetry.riskScore} — initiating reroute`,
  },
  {
    id: "rule_low_inventory",
    condition: (s) => s.telemetry?.inventoryLevel < 25,
    severity: "warning",
    action: "REORDER",
    message: (s) =>
      `${s.name} inventory at ${s.telemetry.inventoryLevel}% — triggering reorder`,
  },
  {
    id: "rule_late_delivery",
    condition: (s) => s.telemetry?.onTimeDeliveryRate < 0.7,
    severity: "warning",
    action: "ESCALATE",
    message: (s) =>
      `${s.name} OTD rate ${Math.round(s.telemetry.onTimeDeliveryRate * 100)}% — escalating`,
  },
  {
    id: "rule_disruption",
    condition: (s) =>
      s.telemetry?.disruption !== null && s.telemetry?.disruption !== undefined,
    severity: "info",
    action: "MONITOR",
    message: (s) => `${s.name} flagged: ${s.telemetry.disruption}`,
  },
];

export const useAgentStore = create((set, get) => ({
  alerts: [],
  pendingActions: [],
  approvedActions: [],
  agentRunning: false,

  // Human-on-the-loop: agent proposes, human approves
  runAgent: (suppliers) => {
    set({ agentRunning: true });
    const alerts = [];
    const pendingActions = [];

    suppliers.forEach((supplier) => {
      RULES.forEach((rule) => {
        if (rule.condition(supplier)) {
          const alert = {
            id: `${rule.id}_${supplier.id}_${Date.now()}`,
            supplierId: supplier.id,
            supplierName: supplier.name,
            severity: rule.severity,
            action: rule.action,
            message: rule.message(supplier),
            timestamp: new Date().toISOString(),
            approved: null,
          };
          alerts.push(alert);
          pendingActions.push(alert);
        }
      });
    });

    set({ alerts, pendingActions, agentRunning: false });
  },

  approveAction: (id) => {
    const pending = get().pendingActions.filter((a) => a.id !== id);
    const approved = get().pendingActions.find((a) => a.id === id);
    set({
      pendingActions: pending,
      approvedActions: [
        ...get().approvedActions,
        { ...approved, approved: true },
      ],
    });
  },

  dismissAction: (id) => {
    set({ pendingActions: get().pendingActions.filter((a) => a.id !== id) });
  },
}));
