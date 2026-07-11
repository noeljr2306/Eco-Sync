import { theme } from "./theme";

// Status-driven colors only — never used decoratively.
export const LEVEL_COLORS = {
  eco: theme.color.emerald,
  moderate: theme.color.safetyYellow,
  high: theme.color.containerRed,
};

export const LEVEL_LABELS = {
  eco: "Low Impact",
  moderate: "Managed",
  high: "Critical",
};

export const ROUTE_COLORS = {
  sea: theme.color.industrialBlue,
  air: theme.color.steel,
  land: theme.color.cargoOrange,
};

export const APP_COPY = {
  title: "EcoSync",
  tagline: "Global Supply Chain Visibility",
  description:
    "Track shipments, suppliers, and emissions across your entire logistics network in real time — from origin to final delivery.",
};

export const CARD_SURFACE = {
  background: theme.color.panel,
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.md,
};