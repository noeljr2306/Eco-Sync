import { useNavigate } from "react-router-dom";
import { motion as _motion } from "framer-motion";
import { ArrowLeft, LineChart } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import data from "../data/supplyChain.json";
import { LEVEL_COLORS, ROUTE_COLORS, APP_COPY } from "../utils/constants";
import { theme } from "../utils/theme";

const emissionData = data.suppliers.map((s) => ({
  name: s.city,
  emission: s.emission,
  color: LEVEL_COLORS[s.level],
}));

const routeTypeData = [
  { type: "Sea", count: data.routes.filter((r) => r.type === "sea").length },
  { type: "Air", count: data.routes.filter((r) => r.type === "air").length },
  { type: "Land", count: data.routes.filter((r) => r.type === "land").length },
];

function CustomBar(props) {
  const { x, y, width, height, index } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={emissionData[index].color}
      fillOpacity={0.9}
      rx={2}
    />
  );
}

const navButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: theme.color.panel,
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.md,
  padding: "8px 16px",
  color: theme.color.textSecondary,
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: theme.font.family,
};

const panelStyle = {
  background: theme.color.panel,
  borderRadius: theme.radius.md,
  padding: "26px 24px",
  marginBottom: 20,
  border: `1px solid ${theme.color.border}`,
};

export default function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <_motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        height: "100vh",
        background: theme.color.bgDeep,
        color: theme.color.textPrimary,
        fontFamily: theme.font.family,
        padding: "0 0 80px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* Top nav */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: theme.color.bg,
          borderBottom: `1px solid ${theme.color.border}`,
          padding: "16px clamp(16px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 700,
            color: theme.color.textPrimary,
            letterSpacing: 0.5,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              background: theme.color.industrialBlue,
              borderRadius: 1,
            }}
          />
          {APP_COPY.title.toUpperCase()}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={navButtonStyle}
          >
            <ArrowLeft size={13} /> Globe View
          </button>
          <button
            type="button"
            onClick={() => navigate("/finance")}
            style={navButtonStyle}
          >
            Finance View <LineChart size={13} />
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "clamp(24px, 4vw, 48px) clamp(16px, 4vw, 32px)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2.5,
              color: theme.color.industrialBlueLight,
              textTransform: "uppercase",
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            Supply Chain Intelligence
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Emissions Analytics
          </h1>
          <p
            style={{
              color: theme.color.textSecondary,
              marginTop: 8,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Real-time overview of supplier emission scores and route
            distribution.
          </p>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 40,
          }}
        >
          {[
            {
              label: "Total Suppliers",
              value: data.suppliers.length,
              color: theme.color.industrialBlueLight,
            },
            {
              label: "Active Routes",
              value: data.routes.length,
              color: theme.color.industrialBlueLight,
            },
            {
              label: "Avg Emission",
              value:
                Math.round(
                  data.suppliers.reduce((a, s) => a + s.emission, 0) /
                    data.suppliers.length,
                ) + "%",
              color: theme.color.safetyYellow,
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: theme.color.panel,
                border: `1px solid ${theme.color.border}`,
                borderTop: `2px solid ${card.color}`,
                borderRadius: theme.radius.md,
                padding: "18px 22px",
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  color: theme.color.textMuted,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: theme.color.textPrimary,
                  fontFamily: theme.font.mono,
                }}
              >
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Emission Bar Chart */}
        <div style={panelStyle}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Emission Score by Supplier
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.color.textMuted,
              marginBottom: 24,
            }}
          >
            CO₂ emission rating out of 100
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={emissionData} barSize={32}>
              <XAxis
                dataKey="name"
                tick={{ fill: theme.color.textMuted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: theme.color.textMuted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: theme.color.panelAlt,
                  border: `1px solid ${theme.color.border}`,
                  borderRadius: 6,
                  fontSize: 12,
                }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="emission" shape={<CustomBar />} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Route Type Chart */}
        <div style={panelStyle}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Routes by Transport Type
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.color.textMuted,
              marginBottom: 24,
            }}
          >
            Distribution of sea, air, and land routes
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={routeTypeData} barSize={48}>
              <XAxis
                dataKey="type"
                tick={{ fill: theme.color.textMuted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.color.textMuted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: theme.color.panelAlt,
                  border: `1px solid ${theme.color.border}`,
                  borderRadius: 6,
                  fontSize: 12,
                }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar
                dataKey="count"
                fill={theme.color.industrialBlue}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Route Table */}
        <div style={{ ...panelStyle, marginBottom: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            All Routes
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.color.textMuted,
              marginBottom: 24,
            }}
          >
            Full breakdown of active supply routes
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.color.border}` }}>
                {["Route", "From", "To", "Type", "Emission Delta"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      color: theme.color.textMuted,
                      fontWeight: 600,
                      fontSize: 10.5,
                      letterSpacing: 1,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.routes.map((route, i) => {
                const from = data.suppliers.find((s) => s.id === route.from);
                const to = data.suppliers.find((s) => s.id === route.to);
                const fromEmission = Number(from?.emission ?? 0);
                const toEmission = Number(to?.emission ?? 0);
                const delta =
                  Number.isFinite(toEmission) && Number.isFinite(fromEmission)
                    ? toEmission - fromEmission
                    : 0;
                const color = ROUTE_COLORS[route.type] || theme.color.steel;
                return (
                  <tr
                    key={`${route.id}-${i}`}
                    style={{
                      borderBottom: `1px solid ${theme.color.border}`,
                      background:
                        i % 2 === 0 ? "transparent" : theme.color.panelAlt,
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        color: theme.color.textMuted,
                        fontSize: 11,
                        fontFamily: theme.font.mono,
                      }}
                    >
                      {route.id.toUpperCase()}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: theme.color.textSecondary,
                      }}
                    >
                      {from?.city ?? "Unknown"}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: theme.color.textSecondary,
                      }}
                    >
                      {to?.city ?? "Unknown"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          background: `${color}18`,
                          border: `1px solid ${color}44`,
                          borderRadius: 3,
                          padding: "3px 8px",
                          color,
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {route.type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color:
                          delta > 0
                            ? theme.color.containerRed
                            : theme.color.emerald,
                        fontWeight: 600,
                        fontFamily: theme.font.mono,
                      }}
                    >
                      {delta > 0 ? "+" : ""}
                      {delta}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </_motion.div>
  );
}
